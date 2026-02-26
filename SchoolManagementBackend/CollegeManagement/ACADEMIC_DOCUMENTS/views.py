from django.db.models import Q
from django.http import HttpResponse
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, RetrieveAPIView
from rest_framework.response import Response

from Acadix.models import ExceptionTrack
from .models import DocumentFile, DocumentGroup
from .serializers import (
    DocumentFileSerializer,
    DocumentFileCreateSerializer,
    DocumentGroupSerializer,
    DocumentSearchSerializer,
)


class DocumentFileListCreateAPIView(ListCreateAPIView):
    """
    Generic endpoint for listing and uploading documents.
    GET: list with filters
    POST: upload a new document (creates/uses a DocumentGroup and versioned DocumentFile)
    """

    queryset = DocumentFile.objects.all()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return DocumentFileCreateSerializer
        return DocumentFileSerializer

    def list(self, request, *args, **kwargs):
        try:
            search_serializer = DocumentSearchSerializer(data=request.query_params)
            search_serializer.is_valid(raise_exception=True)
            data = search_serializer.validated_data

            qs = DocumentFile.objects.filter(is_active=True, group__is_active=True)

            org_id = data.get("organization_id")
            branch_id = data.get("branch_id")
            batch_id = data.get("batch_id")
            course_id = data.get("course_id")
            department_id = data.get("department_id")
            academic_year_id = data.get("academic_year_id")
            semester_id = data.get("semester_id")
            section_id = data.get("section_id")
            subject_id = data.get("subject_id")
            student_id = data.get("student_id")
            employee_id = data.get("employee_id")
            library_branch_id = data.get("library_branch_id")
            group_type = data.get("group_type")
            group_code = data.get("group_code")
            include_history = data.get("include_history")
            search_query = data.get("search_query")
            from_date = data.get("from_date")
            to_date = data.get("to_date")
            uploaded_by = data.get("uploaded_by") or data.get("teacher_id")  # Support both field names

            if org_id:
                qs = qs.filter(group__organization_id=org_id)
            if branch_id:
                qs = qs.filter(group__branch_id=branch_id)
            if batch_id:
                qs = qs.filter(group__batch_id=batch_id)
            if course_id:
                qs = qs.filter(group__course_id=course_id)
            if department_id:
                qs = qs.filter(group__department_id=department_id)
            if academic_year_id:
                qs = qs.filter(group__academic_year_id=academic_year_id)
            if semester_id:
                qs = qs.filter(group__semester_id=semester_id)
            if section_id:
                qs = qs.filter(group__section_id=section_id)
            if subject_id:
                qs = qs.filter(group__subject_id=subject_id)
            if student_id:
                qs = qs.filter(group__student_id=student_id)
            if employee_id:
                qs = qs.filter(group__employee_id=employee_id)
            if library_branch_id:
                qs = qs.filter(group__library_branch_id=library_branch_id)
            if group_type:
                qs = qs.filter(group__group_type=group_type)
            if group_code:
                qs = qs.filter(group__code=group_code)

            if not include_history:
                qs = qs.filter(is_current=True)

            # Filter by document validity period (from_date and to_date on DocumentFile)
            if from_date and to_date:
                # Documents valid during the search period
                # Document's validity period overlaps with search period
                qs = qs.filter(
                    Q(from_date__isnull=True) | Q(from_date__lte=to_date),
                    Q(to_date__isnull=True) | Q(to_date__gte=from_date)
                )
            elif from_date:
                # Documents valid from the search from_date
                qs = qs.filter(
                    Q(from_date__isnull=True) | Q(from_date__lte=from_date),
                    Q(to_date__isnull=True) | Q(to_date__gte=from_date)
                )
            elif to_date:
                # Documents valid until the search to_date
                qs = qs.filter(
                    Q(from_date__isnull=True) | Q(from_date__lte=to_date),
                    Q(to_date__isnull=True) | Q(to_date__gte=to_date)
                )

            # Filter by teacher/staff who uploaded the document
            if uploaded_by:
                qs = qs.filter(uploaded_by=uploaded_by)

            if search_query:
                qs = qs.filter(
                    Q(group__name__icontains=search_query)
                    | Q(group__code__icontains=search_query)
                    | Q(group__description__icontains=search_query)
                    | Q(original_name__icontains=search_query)
                )

            serializer = DocumentFileSerializer(qs, many=True)
            return Response({"message": "success", "data": serializer.data}, status=status.HTTP_200_OK)

        except Exception as e:
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(
                data=request.data,
                context={"uploaded_by": getattr(request.user, "id", None)},
            )
            serializer.is_valid(raise_exception=True)
            document = serializer.save()
            output = DocumentFileSerializer(document).data
            return Response({"message": "success", "data": output}, status=status.HTTP_201_CREATED)
        except Exception as e:
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message: str):
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name="DocumentFileListCreate",
                message=error_message[:200],
                data="",
            )
        except Exception:
            # Avoid secondary failures
            pass


class DocumentFileRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = DocumentFile.objects.all()
    serializer_class = DocumentFileSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            instance: DocumentFile = self.get_object()
            group = instance.group

            # Check if hard delete is requested (via query param)
            hard_delete = request.query_params.get('hard_delete', 'false').lower() == 'true'

            if hard_delete:
                # HARD DELETE: Permanently remove from database
                # This will also delete the binary data from the database
                file_id = instance.id
                was_current = instance.is_current
                instance.delete()  # This permanently removes the record and binary data

                # Don't auto-promote previous version - user must explicitly restore or upload new
                # This prevents accidentally showing old versions when user deletes current one

                # Check if DocumentGroup has any files left, if not, soft delete the group
                remaining_files = DocumentFile.objects.filter(group=group, is_active=True).count()
                if remaining_files == 0:
                    group.is_active = False
                    group.save(update_fields=["is_active"])

                message = f"Document {file_id} permanently deleted"
                if was_current:
                    message += ". No previous version was automatically promoted."

                return Response(
                    {"message": message},
                    status=status.HTTP_200_OK
                )
            else:
                # SOFT DELETE: Mark as inactive but keep data
                was_current = instance.is_current
                instance.is_active = False
                instance.is_current = False
                instance.save(update_fields=["is_active", "is_current"])

                # Only auto-promote previous version if the deleted one was current AND user wants it
                # For now, we don't auto-promote - user must explicitly restore or upload new version
                # This prevents accidentally showing old versions when user deletes current one

                # Check if DocumentGroup has any active files left, if not, soft delete the group
                remaining_files = DocumentFile.objects.filter(group=group, is_active=True).count()
                if remaining_files == 0:
                    group.is_active = False
                    group.save(update_fields=["is_active"])

                message = "Document soft deleted (can be restored)"
                if was_current:
                    message += ". No previous version was automatically promoted - restore or upload a new version to make it current."

                return Response(
                    {"message": message},
                    status=status.HTTP_200_OK
                )

        except Exception as e:
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message: str):
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name="DocumentFileDetail",
                message=error_message[:200],
                data="",
            )
        except Exception:
            pass


class DocumentFileRestoreAPIView(RetrieveAPIView):
    """
    Restore a soft-deleted document (set is_active=True).
    """
    queryset = DocumentFile.objects.all()
    serializer_class = DocumentFileSerializer

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()

            if instance.is_active:
                return Response(
                    {"message": "Document is already active"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Restore the document
            instance.is_active = True
            instance.save(update_fields=["is_active"])

            # If this was the latest version, make it current
            group = instance.group
            current_file = DocumentFile.objects.filter(
                group=group, is_active=True, is_current=True
            ).first()

            if not current_file or instance.version > current_file.version:
                # Mark older versions as not current
                DocumentFile.objects.filter(
                    group=group, is_active=True
                ).exclude(id=instance.id).update(is_current=False)
                instance.is_current = True
                instance.save(update_fields=["is_current"])

            # Restore the group if it was soft-deleted
            if not group.is_active:
                group.is_active = True
                group.save(update_fields=["is_active"])

            serializer = self.get_serializer(instance)
            return Response(
                {"message": "Document restored successfully", "data": serializer.data},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response(
                {"error": error_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def log_exception(self, request, error_message: str):
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name="DocumentFileRestore",
                message=error_message[:200],
                data="",
            )
        except Exception:
            pass


class DocumentGroupListAPIView(ListAPIView):
    serializer_class = DocumentGroupSerializer

    def get_queryset(self):
        org_id = self.request.query_params.get("organization_id")
        branch_id = self.request.query_params.get("branch_id")
        group_type = self.request.query_params.get("group_type")

        qs = DocumentGroup.objects.filter(is_active=True)
        if org_id:
            qs = qs.filter(organization_id=org_id)
        if branch_id:
            qs = qs.filter(branch_id=branch_id)
        if group_type:
            qs = qs.filter(group_type=group_type)
        return qs


class DocumentFileDownloadAPIView(RetrieveAPIView):
    """
    Download file as raw binary (not base64).
    Use this endpoint when you need to download the file directly.
    """
    queryset = DocumentFile.objects.filter(is_active=True)

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()

            if not instance.file_data:
                return Response(
                    {"error": "File data not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Return raw binary response
            response = HttpResponse(
                instance.file_data,
                content_type=instance.mime_type or 'application/octet-stream'
            )
            response['Content-Disposition'] = f'attachment; filename="{instance.original_name or "document"}"'
            response['Content-Length'] = str(instance.size or len(instance.file_data))
            return response

        except Exception as e:
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response(
                {"error": error_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def log_exception(self, request, error_message: str):
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name="DocumentFileDownload",
                message=error_message[:200],
                data="",
            )
        except Exception:
            pass