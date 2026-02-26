from django.core.exceptions import ObjectDoesNotExist
from django.db import DatabaseError
from django.http import Http404
from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.response import Response

from Acadix.models import ExceptionTrack, Organization, Branch, AcademicYear, Batch
from TRAINING_PLACEMENT.models import TrainingPlacement, TrainingPlacement
from TRAINING_PLACEMENT.serializers import TrainingPlacementSerializer, TrainingPlacementSearchSerializer, \
    TrainingPlacementSerializer


# Create your views here.


class TrainingPlacementCreateAPIView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TrainingPlacementSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Get Validate Data
            company_name = serializer.validated_data.get('company_name')
            module = serializer.validated_data.get('module')
            duration = serializer.validated_data.get('duration')
            from_date = serializer.validated_data.get('from_date')
            to_date = serializer.validated_data.get('to_date')
            participants = serializer.validated_data.get('participants')

            hr_name = serializer.validated_data.get('hr_name')

            organization = serializer.validated_data.get('organization')
            branch = serializer.validated_data.get('branch')
            batch = serializer.validated_data.get('batch')
            created_by= serializer.validated_data.get('created_by')
            
            # Get the new fields
            course = serializer.validated_data.get('course')
            department = serializer.validated_data.get('department')
            academic_year = serializer.validated_data.get('academic_year')
            semester = serializer.validated_data.get('semester')

            # The serializer returns the actual objects for ForeignKey fields
            # So we can use them directly in the create() call

            OrganizationInstance = organization
            BranchInstance = branch
            BatchInstance = batch

            # Validate that objects exist


            if not OrganizationInstance or not OrganizationInstance.is_active:
                return Response({'message': 'Organization Id does Not Exist or is not active'}, status=status.HTTP_400_BAD_REQUEST)

            if not BranchInstance or not BranchInstance.is_active:
                return Response({'message': 'Branch Id does Not Exist or is not active'}, status=status.HTTP_400_BAD_REQUEST)

            if not BatchInstance or not BatchInstance.is_active:
                return Response({'message': 'Batch Id does Not Exist or is not active'}, status=status.HTTP_400_BAD_REQUEST)

            # Expense & Income category Create

            TrainingPlacementInstance = TrainingPlacement.objects.create(

                company_name=company_name,
                module= module,
                duration= duration,
                from_date = from_date,
                to_date = to_date,
                participants= participants,
                hr_name= hr_name,

                organization=OrganizationInstance,
                branch=BranchInstance,
                batch=BatchInstance,
                course=course,
                department=department,
                academic_year=academic_year,
                semester=semester,
                created_by=created_by,
                updated_by=created_by

            )

            return Response({'message': 'success', }, status=status.HTTP_200_OK)



        except ValidationError as e:

            # Rollback the transaction on validation error

            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)


        except DatabaseError as e:

            # Rollback the transaction on database error

            self.log_exception(request, str(e))

            return Response({'error': 'A database error occurred: ' + str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        except Exception as e:

            # Rollback the transaction on any other exception

            self.log_exception(request, str(e))

            return Response({'error': 'An unexpected error occurred: ' + str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        try:
            ExceptionTrack.objects.create(

                request=str(request),

                process_name='Training_PlacementCreate',

                message=error_message,

            )
        except Exception as log_error:
            # If logging fails, just print to console
            print(f"Failed to log exception: {log_error}")
            print(f"Original error: {error_message}")


class TrainingPlacementListAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TrainingPlacementSearchSerializer

    def list(self, request, *args, **kwargs):
        try:

            organization_id= request.query_params.get('organization_id')
            branch_id= request.query_params.get('branch_id')
            batch_id= request.query_params.get('batch_id')
            company_name = request.query_params.get('company_name')
            module = request.query_params.get('module')
            from_date = request.query_params.get('from_date')
            to_date = request.query_params.get('to_date')
            
            # Get the new filter parameters
            course_id = request.query_params.get('course_id')
            department_id = request.query_params.get('department_id')
            academic_year_id = request.query_params.get('academic_year_id')
            semester_id = request.query_params.get('semester_id')


            if not organization_id:
                return Response({'message':'Please Provide organization_id'},status=status.HTTP_400_BAD_REQUEST)
            if not branch_id:
                return Response({'message':'Please Provide branchId'},status=status.HTTP_400_BAD_REQUEST)

            try:
                # Start with base filters
                filters_dict = {

                    'organization': organization_id,
                    'branch': branch_id,
                    'is_active': True
                }
                
                # Add batch filter only if batch_id is provided
                if batch_id:
                    filters_dict['batch'] = batch_id
                
                # Add the new filters if provided
                if course_id:
                    filters_dict['course'] = course_id
                if department_id:
                    filters_dict['department'] = department_id
                if academic_year_id:
                    filters_dict['academic_year'] = academic_year_id
                if semester_id:
                    filters_dict['semester'] = semester_id
                
                training_placement_records = TrainingPlacement.objects.filter(**filters_dict)
            except:
                training_placement_records= None

            if training_placement_records:

                if company_name:
                    training_placement_records = training_placement_records.filter(company_name__icontains=company_name)

                if module:
                    training_placement_records = training_placement_records.filter(module__icontains=module)

                if from_date:
                    training_placement_records = training_placement_records.filter(from_date__gte=from_date)

                if to_date:
                    training_placement_records = training_placement_records.filter(to_date__lte= to_date)

                responsedata=[]

                for item in training_placement_records:
                    try:
                        organizationInstance = Organization.objects.get(id=item.organization.id,is_active=True)
                    except:
                        return Response({'message':'error occurs while response making for organization'},status=status.HTTP_404_NOT_FOUND)
                    try:
                        branchInstance = Branch.objects.get(id=item.branch.id,is_active=True)
                    except:
                        return Response({'message':'error occurs while response making for branch'},status=status.HTTP_404_NOT_FOUND)

                    try:
                        if item.batch:
                            batchInstance = Batch.objects.get(id=item.batch.id,is_active=True)
                        else:
                            batchInstance = None
                    except:
                        batchInstance = None
                    
                    # Get names from the direct foreign key fields
                    course_name = item.course.course_name if item.course else None
                    department_name = item.department.department_description if item.department else None
                    academic_year_description = item.academic_year.academic_year_description if item.academic_year else None
                    semester_name = item.semester.semester_description if item.semester else None
                    
                    data={
                        "id": item.id,
                        "company_name": item.company_name,
                        "module": item.module,
                        "duration": item.duration,
                        "from_date": item.from_date,
                        "to_date": item.to_date,
                        "participants": item.participants,
                        "hr_name": item.hr_name,

                        "organization_id": organizationInstance.id,
                        "organization_name": organizationInstance.organization_code,
                        "branch_id": branchInstance.id,
                        "branch_name": branchInstance.branch_name,
                        "batch_id": batchInstance.id if batchInstance else None,
                        "batch_name": batchInstance.batch_code if batchInstance else None,
                        
                        # Add the new fields
                        "course_id": item.course.id if item.course else None,
                        "course_name": course_name,
                        "department_id": item.department.id if item.department else None,
                        "department_name": department_name,
                        "academic_year_id": item.academic_year.id if item.academic_year else None,
                        "academic_year_description": academic_year_description,
                        "semester_id": item.semester.id if item.semester else None,
                        "semester_name": semester_name,

                    }
                    responsedata.append(data)

                if responsedata:
                    return Response({'message':'success','data':responsedata},status=status.HTTP_200_OK)
                else:
                    return Response({'message':'No Record Found'},status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:499],
                process_name='Training_PlacementList',
                message=error_message,
            )
        except:
            pass


class TrainingPlacementRetrieveAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TrainingPlacementSerializer

    def retrieve(self, request, *args, **kwargs):
        try:
            # Get ID from query parameters
            trainingId = request.query_params.get('id')
            
            if not trainingId:
                return Response({'message': 'Please provide id parameter'}, status=status.HTTP_400_BAD_REQUEST)

            # Get Training Record
            try:
                TrainingPlacementInstance = TrainingPlacement.objects.get(id=trainingId, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'provided Training Id Not found!'}, status=status.HTTP_200_OK)

            if TrainingPlacementInstance:

                try:
                    organizationInstance = Organization.objects.get(id=TrainingPlacementInstance.organization.id, is_active=True)
                except:
                    return Response({'message': 'error occurs while response making for organization'},
                                    status=status.HTTP_404_NOT_FOUND)
                try:
                    branchInstance = Branch.objects.get(id=TrainingPlacementInstance.branch.id, is_active=True)
                except:
                    return Response({'message': 'error occurs while response making for branch'},
                                    status=status.HTTP_404_NOT_FOUND)

                try:
                    batchInstance = Batch.objects.get(id=TrainingPlacementInstance.batch.id, is_active=True)
                except:
                    return Response({'message': 'error occurs while response making for batch'},
                                    status=status.HTTP_404_NOT_FOUND)

                data = {
                    'id': TrainingPlacementInstance.id,
                    'company_name': TrainingPlacementInstance.company_name,
                    'module': TrainingPlacementInstance.module,
                    'duration':TrainingPlacementInstance.duration,
                    'from_date': TrainingPlacementInstance.from_date,
                    'to_date': TrainingPlacementInstance.to_date,
                    'participants': TrainingPlacementInstance.participants,
                    'hr_name': TrainingPlacementInstance.hr_name,

                    "organization_id": organizationInstance.id,
                    "organization_name": organizationInstance.organization_code,
                    "branch_id": branchInstance.id,
                    "branch_name": branchInstance.branch_name,
                    "batch_id": batchInstance.id,
                    "batch_name": batchInstance.batch_code,
                    
                    # Add the new field IDs for edit mode
                    "course_id": TrainingPlacementInstance.course.id if TrainingPlacementInstance.course else None,
                    "department_id": TrainingPlacementInstance.department.id if TrainingPlacementInstance.department else None,
                    "academic_year_id": TrainingPlacementInstance.academic_year.id if TrainingPlacementInstance.academic_year else None,
                    "semester_id": TrainingPlacementInstance.semester.id if TrainingPlacementInstance.semester else None,

                }

                return Response({'message': 'success', 'data': data}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)

        except Http404:

            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='Training_PlacementRetrieve',

            message=error_message,

        )


class TrainingPlacementUpdateAPIView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = TrainingPlacement.objects.all()
    serializer_class = TrainingPlacementSerializer

    def update(self, request, *args, **kwargs):
        try:
            # Get ID from query parameters
            trainingId = request.query_params.get('id')
            
            if not trainingId:
                return Response({'message': 'Please provide id parameter'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get the object manually instead of using get_object()
            try:
                TrainingInstance = TrainingPlacement.objects.get(id=trainingId, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Training record not found'}, status=status.HTTP_404_NOT_FOUND)
            
            partial = kwargs.pop('partial', False)

            # validate input data
            serializer = self.get_serializer(TrainingInstance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)


            # Get Validate data

            company_name = serializer.validated_data.get('company_name')
            module = serializer.validated_data.get('module')
            duration = serializer.validated_data.get('duration')
            from_date = serializer.validated_data.get('from_date')
            to_date = serializer.validated_data.get('to_date')
            participants = serializer.validated_data.get('participants')
            hr_name = serializer.validated_data.get('hr_name')
            organization = serializer.validated_data.get('organization')
            branch = serializer.validated_data.get('branch')

            batch = serializer.validated_data.get('batch')
            created_by = serializer.validated_data.get('created_by')
            
            # Get the new fields
            course = serializer.validated_data.get('course')
            department = serializer.validated_data.get('department')
            academic_year = serializer.validated_data.get('academic_year')
            semester = serializer.validated_data.get('semester')


            # Get Org & branch & academic year Instance



            OrganizationInstance = organization
            if not OrganizationInstance or not OrganizationInstance.is_active:
                return Response({'message': 'Provided Organization Id not found or inactive'}, status=status.HTTP_404_NOT_FOUND)

            BranchInstance = branch
            if not BranchInstance or not BranchInstance.is_active:
                return Response({'message': 'Provided Branch Id not found or inactive'}, status=status.HTTP_404_NOT_FOUND)

            BatchInstance = batch
            if not BatchInstance or not BatchInstance.is_active:
                return Response({'message': 'Provided Batch Id not found or inactive'}, status=status.HTTP_404_NOT_FOUND)



            # Update the Record

            TrainingInstance.company_name = company_name
            TrainingInstance.module = module
            TrainingInstance.duration = duration
            TrainingInstance.from_date = from_date
            TrainingInstance.to_date = to_date
            TrainingInstance.participants = participants
            TrainingInstance.hr_name = hr_name

            TrainingInstance.organization = OrganizationInstance
            TrainingInstance.branch = BranchInstance
            TrainingInstance.batch = BatchInstance
            TrainingInstance.course = course
            TrainingInstance.department = department
            TrainingInstance.academic_year = academic_year
            TrainingInstance.semester = semester
            TrainingInstance.updated_by = created_by

            TrainingInstance.save()

            return Response({'message':'success'},status=status.HTTP_200_OK)


        except Http404:

            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)



        except ValidationError as e:

            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)



        except DatabaseError as e:

            self.log_exception(request, str(e))

            return Response({'error': 'A database error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



        except Exception as e:

            self.log_exception(request, str(e))

            return Response({'error': 'An unexpected error occurred.' + str(e)},

                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='Training_PlacementUpdate',

            message=error_message,

        )


class TrainingPlacementDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = TrainingPlacement.objects.all()
    serializer_class = TrainingPlacementSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            # Get ID from query parameters
            trainingId = request.query_params.get('id')
            
            if not trainingId:
                return Response({'message': 'Please provide id parameter'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get the object manually instead of using get_object()
            try:
                instance = TrainingPlacement.objects.get(id=trainingId, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Training record not found'}, status=status.HTTP_404_NOT_FOUND)

            if instance.is_active:
                instance.is_active = False
                instance.save()

                return Response({'message': 'success'},
                                status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Record already deactivated.'},
                                status=status.HTTP_400_BAD_REQUEST)
        except Http404:
            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)


