import base64
import json
import mimetypes
import os.path
import uuid
from datetime import datetime, timedelta, date

from django.core.files.storage import default_storage
# from django.contrib.messages.storage import default_storage
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import OuterRef, Subquery, Max, Q, Count, Sum
from django.http import Http404
from django.shortcuts import render
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from Acadix.models import ExceptionTrack, Organization, Branch, Batch, AcademicYear, StudentCourse, EmployeeMaster, \
    StudentRegistration, StudentFeeDetail, Period
from STAFF.models import EmployeeAssignment
from Library.models import BookCategory, BookSubCategory, BookLocation, LibraryBook, \
    LibraryBooksBarcode, LibraryBranch, LibraryPurchase, LibraryBooksIssues, ParameterValue
from Library.serializers import BookCategorySerializers, BookSubCategorySerializers, BookCategoryUpdateSerializers, \
    BookSubCategoryUpdateSerializers, BookLocationSerializer, LibraryBookSerializer, LibraryBranchSerializer, \
    LibraryBookCreateSerializer, LibraryBookSearch, LibraryBookUpdateSerializer, IssuesBookSearchSerializer, \
    BookDetailsListSerializer, BookIssuesSerializer, BookIssuedUpdateSerializer, LibraryBooksBarcodeSerializer, \
    BookTitleReportSerializer, IssueReturnReportSerializer, CheckBookLostDamagedSerializer, LibraryBookReportSerializer, \
    LibraryBookBarcodeValidationSerializer, LibraryBookConfigurationSerializer, LibraryBookConfigurationUpdateSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from django.db import transaction, DatabaseError

from Swostitech_Acadix import settings


# Create your views here.

class BookCategoryCreateAPIView(CreateAPIView):
    queryset = BookCategory.objects.all()
    serializer_class = BookCategorySerializers

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Get validate data

            category_name = serializer.validated_data.get('category_name').upper()
            category_description = serializer.validated_data.get('category_description',
                                                                 '').upper() if serializer.validated_data.get(
                'category_description') else ''
            created_by = serializer.validated_data.get('created_by')
            organization_id = serializer.validated_data.get('organization_id')
            batch_id = serializer.validated_data.get('batch_id')
            is_active = serializer.validated_data.get('is_active')

            # Get Organization Instance
            OrganizationInstance = Organization.objects.get(id=organization_id)

            # Get Branch Instance
            BatchInstance = Batch.objects.get(id=batch_id)

            # Check book category already exist or not

            if BookCategory.objects.filter(category_name=category_name, organization_id=organization_id,
                                           batch_id=batch_id,
                                           is_active=True).exists():
                return Response({'message': 'Category Name already added '}, status=status.HTTP_400_BAD_REQUEST)

            # save Book Category

            BookCategory_instance = BookCategory(
                category_name=category_name,
                category_description=category_description,
                organization=OrganizationInstance,
                batch=BatchInstance,
                is_active=is_active,
                created_by=created_by,
                updated_by=created_by
            )

            # Save the data in DB

            BookCategory_instance.save()

            # Make response data based on serializer
            data = BookCategorySerializers(BookCategory_instance).data

            return Response({'message': 'Category Added successfully', 'data': data}, status=status.HTTP_201_CREATED)

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
        ExceptionTrack.objects.create(
            request=str(request)[:100],
            process_name='BookCategorycreate',
            message=error_message[:200],
            data='',
        )


class BookCategoryListAPIView(ListAPIView):
    queryset = BookCategory.objects.all()
    serializer_class = BookCategorySerializers

    def list(self, request, *args, **kwargs):
        try:
            response = super().list(request, *args, **kwargs)
            resdata = response.data

            if resdata:
                responsedata = []
                for item in resdata:
                    # if item.get('is_active') == True:

                    # Get Data
                    organization_id = item.get('organization')
                    batch_id = item.get('batch')

                    Organization_instance = Organization.objects.get(pk=organization_id)

                    batch_instance = Batch.objects.get(pk=batch_id)

                    # Prepare the custom response data
                    responsedata.append({
                        'id': item.get('id'),
                        'category_name': item.get('category_name'),
                        'category_description': item.get('category_description'),
                        'orgId': Organization_instance.id,
                        'organization_code': Organization_instance.organization_code,
                        'batch_id': batch_instance.id,
                        'batch_description': batch_instance.batch_description,
                        'is_active': item.get('is_active'),
                    })
                    # else:
                    #     continue
                if responsedata:

                    return Response({'message': 'Success', 'data': responsedata}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

        except Exception as e:
            # Log the exception
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request)[:100],
            process_name='BookCategorylist',
            message=error_message[:200],
            data='',
        )


class BookCategoryUpdateAPIView(UpdateAPIView):
    queryset = BookCategory.objects.all()
    serializer_class = BookCategoryUpdateSerializers

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()

            # validate input data
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)

            # Access serializer data
            category_name = serializer.validated_data.get('category_name').upper()
            category_description = serializer.validated_data.get('category_description').upper()
            organization_id = serializer.validated_data.get('organization_id')
            branch_id = serializer.validated_data.get('branch_id')
            is_active = serializer.validated_data.get('is_active')
            updated_by = serializer.validated_data.get('updated_by')

            # print(category_name,category_description,organization_id,branch_id,updated_by)

            # Check if no changes were made
            if (instance.category_name == category_name and
                    instance.category_description == category_description and
                    instance.organization_id == organization_id and
                    instance.branch_id == branch_id and
                    instance.is_active == is_active

            ):
                return Response({'message': 'No changes identified'}, status=status.HTTP_200_OK)

            # Check if a similar record already exists
            if BookCategory.objects.exclude(pk=instance.pk).filter(

                    category_name=category_name,
                    organization_id=organization_id,
                    branch_id=branch_id,
                    is_active=True,

            ).exists():
                return Response({'message': 'This Book category already exist.'}, status=status.HTTP_400_BAD_REQUEST)

            # Update instance with new data
            instance.category_name = category_name
            instance.category_description = category_description
            instance.organization_id = organization_id
            instance.branch_id = branch_id
            instance.is_active = is_active
            instance.updated_by = updated_by

            instance.save()

            return Response({'message': 'Book category  updated successfully.'}, status=status.HTTP_200_OK)

        except Http404:
            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            self.log_exception(request, str(e))
            return Response({'error': 'A database error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            self.log_exception(request, str(e))
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='BookCategoryUpdate',
            message=error_message,
        )


class BookCategoryDestroyAPIView(DestroyAPIView):
    queryset = BookCategory.objects.all()
    serializer_class = BookCategorySerializers

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()

            return Response({'message': 'Book  Category Deactivated Successfully'}, status=status.HTTP_200_OK)

        except Http404:
            return Response({'message': 'record not found'}, status=status.HTTP_404_NOT_FOUND)


class BookSubCategoryCreateAPIView(CreateAPIView):
    queryset = BookSubCategory.objects.all()
    serializer_class = BookSubCategorySerializers

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Get validate data

            category_id = serializer.validated_data.get('category_id')
            sub_category_name = serializer.validated_data.get('sub_category_name', '').upper()
            sub_category_description = serializer.validated_data.get('sub_category_description', '') or ''
            sub_category_description = sub_category_description.upper() if sub_category_description else ''
            is_active = serializer.validated_data.get('is_active')
            created_by = serializer.validated_data.get('created_by')

            # Get book category Instance
            CategoryInstance = BookCategory.objects.get(id=category_id)

            # Check book category already exist or not

            if BookSubCategory.objects.filter(category=CategoryInstance, sub_category_name=sub_category_name,
                                              is_active=True).exists():
                return Response({'message': 'SubCategory Name already exist '}, status=status.HTTP_400_BAD_REQUEST)

            # save PickUp points

            BookSubCategory_instance = BookSubCategory(
                category=CategoryInstance,
                sub_category_name=sub_category_name,
                sub_category_description=sub_category_description,
                is_active=is_active,
                created_by=created_by,
                updated_by=created_by
            )

            # Save the data in DB

            BookSubCategory_instance.save()

            # Make response data based on serializer
            data = BookSubCategorySerializers(BookSubCategory_instance).data

            if not is_active:
                return Response({'message': 'SubCategory is added but not active', 'data': data},
                                status=status.HTTP_201_CREATED)

            else:
                return Response({'message': 'SubCategory Added successfully', 'data': data},
                                status=status.HTTP_201_CREATED)

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
        ExceptionTrack.objects.create(
            request=str(request)[:100],
            process_name='BookSubCategorycreate',
            message=str(error_message)[:200],
            data='',
        )


class GetAllBooksBasedOnCategoryWise(ListAPIView):
    serializer_class = BookSubCategorySerializers

    def get_queryset(self):
        category_id = self.kwargs.get('pk')

        # Get filter Route Record
        subcategory_Data = BookSubCategory.objects.filter(
            category_id=category_id
            # is_active=True
        )

        return subcategory_Data

    def list(self, request, *args, **kwargs):
        try:
            response = super().list(request, *args, **kwargs)
            resdata = response.data

            if resdata:
                responsedata = []

                CategoryInstance = BookCategory.objects.get(id=self.kwargs.get('pk'))

                for item in resdata:
                    # Prepare the custom response data
                    if item.get('is_active'):
                        responsedata.append({
                            # 'RouteId':self.kwargs.get('pk'),
                            'categoryId': CategoryInstance.id,
                            'categoryName': CategoryInstance.category_name,
                            'id': item.get('id'),
                            'Subcategory_name': item.get('SubCategoryName'),
                            'Subcategory_description': item.get('Subcategory_description'),
                            'is_active': item.get('is_active')

                        })

                if responsedata:
                    return Response({'message': 'Success', 'data': responsedata}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

        except Exception as e:
            # Log the exception
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request)[:100],
            process_name='GetSubCategoryList',
            message=str(error_message)[:200],
            data='',
        )


class BookSubCategoryUpdateAPIView(UpdateAPIView):
    queryset = BookSubCategory.objects.all()
    serializer_class = BookSubCategoryUpdateSerializers

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()

            # validate input data
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)

            # Access serializer data
            category_id = serializer.validated_data.get('category_id')
            sub_category_name = serializer.validated_data.get('sub_category_name', '').upper()
            sub_category_description = serializer.validated_data.get('sub_category_description', '') or ''
            sub_category_description = sub_category_description.upper() if sub_category_description else ''
            is_active = serializer.validated_data.get('is_active')
            updated_by = serializer.validated_data.get('updated_by')

            # Get category instance
            CategoryInstance = BookCategory.objects.get(id=category_id)

            # Check if no changes were made
            if (instance.category_id == category_id and
                    instance.sub_category_name == sub_category_name and
                    instance.sub_category_description == sub_category_description and
                    instance.is_active == is_active

            ):
                return Response({'message': 'No changes identified'}, status=status.HTTP_200_OK)

            # Check if a similar record already exists
            if BookSubCategory.objects.exclude(pk=instance.pk).filter(
                    category_id=category_id,
                    sub_category_name=sub_category_name,
                    is_active=True,
            ).exists():
                return Response({'message': 'This Book Subcategory already exist.'}, status=status.HTTP_400_BAD_REQUEST)

            # Update instance with new data
            instance.category = CategoryInstance
            instance.sub_category_name = sub_category_name
            instance.sub_category_description = sub_category_description
            instance.is_active = is_active
            instance.updated_by = updated_by

            instance.save()

            return Response({'message': 'Book subcategory  updated successfully.'}, status=status.HTTP_200_OK)

        except Http404:
            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            self.log_exception(request, str(e))
            return Response({'error': 'A database error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            self.log_exception(request, str(e))
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request)[:100],
            process_name='BookSubCategoryUpdate',
            message=str(error_message)[:200],
            data='',
        )


class BookSubCategoryDestroyAPIView(DestroyAPIView):
    queryset = BookSubCategory.objects.all()
    serializer_class = BookSubCategorySerializers

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()

            return Response({'message': 'Book  SubCategory Deactivated Successfully'}, status=status.HTTP_200_OK)
            # else:
            #     return Response({'message': 'Book SubCategory already Deactivated.'}, status=status.HTTP_400_BAD_REQUEST)

        except Http404:
            return Response({'message': 'record not found'}, status=status.HTTP_404_NOT_FOUND)


class GetAllCategorySubCategoryListAPIView(ListAPIView):
    queryset = BookSubCategory.objects.all()
    serializer_class = BookSubCategorySerializers

    def list(self, request, *args, **kwargs):
        try:
            response = super().list(request, *args, **kwargs)
            resdata = response.data

            if resdata:
                responsedata = []

                for item in resdata:
                    categoryId = item.get('category')
                    CategoryInstance = BookCategory.objects.get(id=categoryId)
                    # Prepare the custom response data

                    responsedata.append({
                        # 'RouteId':self.kwargs.get('pk'),
                        'id': item.get('id'),
                        'categoryName': CategoryInstance.category_name,
                        'Subcategory_name': item.get('SubCategoryName'),
                        'Subcategory_description': item.get('Subcategory_description'),
                        'is_active': item.get('is_active')

                    })

                if responsedata:
                    return Response({'message': 'Success', 'data': responsedata}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

        except Exception as e:
            # Log the exception
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request)[:100],
            process_name='GetCategoryWithSubCategoryList',
            message=str(error_message)[:200],
            data='',
        )


# class BookLocationListAPIView(ListAPIView):
#     queryset = BookLocation.objects.all()
#     serializer_class = BookLocationSerializer
#
#     def list(self, request, *args, **kwargs):
#         try:
#             response = super().list(request, *args, **kwargs)
#             resdata = response.data
#
#             if resdata:
#                 responsedata = []
#
#                 for item in resdata:
#                     # categoryId = item.get('CategoryId')
#                     # CategoryInstance = BookCategory.objects.get(id=categoryId)
#
#                     OrganizationInstance = Organization.objects.get(id=item.get('organization_id'))
#
#                     BatchInstance = Batch.objects.get(id=item.get('branch_id'))
#                     # Prepare the custom response data
#
#                     responsedata.append({
#                         # 'RouteId':self.kwargs.get('pk'),
#                         'id': item.get('id'),
#                         'booklocation': item.get('booklocation'),
#                         'booklocation_desc': item.get('booklocation_desc'),
#                         'organization_id': OrganizationInstance.id,
#                         'organizationName': OrganizationInstance.organization_code,
#                         'branch_id': BatchInstance.id,
#                         'branchname': BatchInstance.batch_code,
#                         'is_active': item.get('is_active')
#
#                     })
#
#                 if responsedata:
#                     return Response({'message': 'Success', 'data': responsedata}, status=status.HTTP_200_OK)
#                 else:
#                     return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)
#
#             else:
#                 return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)
#
#         except Exception as e:
#             # Log the exception
#             error_message = str(e)
#             self.log_exception(request, error_message)
#             return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#     def log_exception(self, request, error_message):
#         ExceptionTrack.objects.create(
#             request=str(request),
#             process_name='BookLocationList',
#             message=error_message,
#
#         )
#
#
#
#     # @transaction.atomic
#     # def create(self, request, *args, **kwargs):
#     #     try:
#     #         # Start a new atomic transaction
#     #         with transaction.atomic():
#     #             serializer= self.get_serializer(data=request.data)
#     #             serializer.is_valid(raise_exception=True)
#     #
#     #             #Get validate data
#     #
#     #             loginId = serializer.validated_data.get('loginId')
#     #             book_code = serializer.validated_data.get('book_code')
#     #             book_name = serializer.validated_data.get('book_name').upper()
#     #             book_category = serializer.validated_data.get('book_category')
#     #             book_sub_category = serializer.validated_data.get('book_sub_category')
#     #
#     #             book_status = serializer.validated_data.get('book_status')
#     #             total_no_of_copies = serializer.validated_data.get('total_no_of_copies')
#     #             organization_id = serializer.validated_data.get('organization_id')
#     #             branch_id = serializer.validated_data.get('branch_id')
#     #
#     #             publisher = serializer.validated_data.get('publisher').upper()
#     #             author = serializer.validated_data.get('author').upper()
#     #             publish_year = serializer.validated_data.get('publish_year')
#     #             volume = serializer.validated_data.get('volume')
#     #
#     #             front_cover = serializer.validated_data.get('front_cover')
#     #             back_cover = serializer.validated_data.get('back_cover')
#     #             edition = serializer.validated_data.get('edition')
#     #             pages = serializer.validated_data.get('pages')
#     #
#     #             date_of_purchase = serializer.validated_data.get('date_of_purchase')
#     #             purchased_from = serializer.validated_data.get('purchased_from')
#     #             bill_no = serializer.validated_data.get('bill_no')
#     #             no_of_copies = serializer.validated_data.get('no_of_copies')
#     #             bill_value = serializer.validated_data.get('bill_value')
#     #             bill_concession = serializer.validated_data.get('bill_concession')
#     #
#     #             book = serializer.validated_data.get('book')
#     #             barcode = serializer.validated_data.get('barcode')
#     #             book_barcode_status = serializer.validated_data.get('book_barcode_status')
#     #             remarks = serializer.validated_data.get('remarks')
#     #             locationId = serializer.validated_data.get('locationId')
#     #
#     #             # Book Category Instance
#     #             try:
#     #                 BookcategoryInstance = BookCategory.objects.get(id=book_category,is_active=True)
#     #             except:
#     #                 return Response({'message':'Book category not found'},status=status.HTTP_400_BAD_REQUEST)
#     #
#     #             # Book SubCategory Instance
#     #             try:
#     #                 booksubcategoryInstance = BookCategory.objects.get(id=book_sub_category,is_active=True)
#     #             except:
#     #                 return Response({'message':'Book subcategory not found'},status=status.HTTP_400_BAD_REQUEST)
#     #
#     #             # Organization Instance
#     #             try:
#     #                 organizationInstance = Organization.objects.get(id=organization_id,is_active=True)
#     #             except:
#     #                 return Response({'message':'Organization not found'},status=status.HTTP_400_BAD_REQUEST)
#     #
#     #             # Batch Instance
#     #             try:
#     #                 branchInstance = Batch.objects.get(id=branch_id, is_active=True)
#     #             except:
#     #                 return Response({'message': 'Branch not found'}, status=status.HTTP_400_BAD_REQUEST)
#     #
#     #
#     #
#     #             #  Save data Into database
#     #
#     #             LibraryBookInstance = LibraryBook.objects.create(
#     #                 book_code=book_code,
#     #                 book_name =book_name,
#     #                 book_category=BookcategoryInstance,
#     #                 book_sub_category=booksubcategoryInstance,
#     #                 book_status=book_status,
#     #                 no_of_copies=total_no_of_copies,
#     #                 organization_id=organizationInstance,
#     #                 branch_id=branchInstance,
#     #                 publisher=publisher,
#     #                 author=author,
#     #                 publish_year=publish_year,
#     #                 volume=volume,
#     #                 front_cover=front_cover,
#     #                 back_cover=back_cover,
#     #                 edition=edition,
#     #                 pages=pages,
#     #                 barcode_auto_generated=pass
#     #
#     #             )
#
#
#
#
#
#
#
#
#
#
#
#
#
#             #
#             # # Get book category Instance
#             # CategoryId = BookCategory.objects.get(id=CategoryId.id)
#             #
#             #
#             #
#             # # Check book category already exist or not
#             #
#             # if BookSubCategory.objects.filter(CategoryId=CategoryId,Subcategory_name=Subcategory_name,is_active=True).exists():
#             #     return Response({'message':'SubCategory Name already exist '},status=status.HTTP_400_BAD_REQUEST)
#             #
#             # # save PickUp points
#             #
#             # BookSubCategory_instance = BookSubCategory(
#             #     CategoryId=CategoryId,
#             #     Subcategory_name = Subcategory_name,
#             #     Subcategory_description = Subcategory_description,
#             #     is_active = is_active,
#             #     created_by= created_by,
#             #     updated_by=created_by
#             # )
#             #
#             # #Save the data in DB
#             #
#             # BookSubCategory_instance.save()
#             #
#             # # Make response data based on serializer
#             # data = BookSubCategorySerializers(BookSubCategory_instance).data
#             #
#             # return Response({'message': 'SubCategory Added successfully', 'data': data},status=status.HTTP_201_CREATED)
#     #
#     #     except ValidationError as e:
#     #         # Rollback the transaction on validation error
#     #         return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
#     #
#     #     except DatabaseError as e:
#     #         # Rollback the transaction on database error
#     #         self.log_exception(request, str(e))
#     #         return Response({'error': 'A database error occurred: ' + str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#     #
#     #     except Exception as e:
#     #         # Rollback the transaction on any other exception
#     #         self.log_exception(request, str(e))
#     #         return Response({'error': 'An unexpected error occurred: ' + str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#     #
#     # def log_exception(self, request, error_message):
#     #     ExceptionTrack.objects.create(
#     #         request=str(request),
#     #         process_name='BookSubCategorycreate',
#     #         message=error_message,
#     #     )

# BookLocation CRUD APIs
class BookLocationCreateAPIView(CreateAPIView):
    queryset = BookLocation.objects.all()
    serializer_class = BookLocationSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Get validated data
            book_location = serializer.validated_data.get('book_location').upper()
            book_location_desc = serializer.validated_data.get('book_location_desc', '').upper()
            created_by = serializer.validated_data.get('created_by')
            organization_id = serializer.validated_data.get('organization_id')
            batch = serializer.validated_data.get('batch')
            is_active = serializer.validated_data.get('is_active')

            # Get Organization Instance
            OrganizationId = Organization.objects.get(id=organization_id.id)

            # Get Branch Instance
            batch_id = Batch.objects.get(id=batch.id)

            # Check if book location already exists
            if BookLocation.objects.filter(book_location=book_location, organization_id=organization_id,
                                           batch_id=batch_id,
                                           is_active=True).exists():
                return Response({'message': 'Book Location already exists'}, status=status.HTTP_400_BAD_REQUEST)

            # Save Book Location
            BookLocation_instance = BookLocation(
                book_location=book_location,
                book_location_desc=book_location_desc,
                organization_id=OrganizationId,
                batch=batch_id,
                is_active=is_active,
                created_by=created_by,
                updated_by=created_by
            )

            # Save the data in DB
            BookLocation_instance.save()

            return Response({'message': 'Book Location created successfully'}, status=status.HTTP_201_CREATED)

        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)
        except Batch.DoesNotExist:
            return Response({'error': 'Branch not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError as e:
            self.log_exception(request, str(e))
            return Response({'error': 'A database error occurred: ' + str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            self.log_exception(request, str(e))
            return Response({'error': 'An unexpected error occurred: ' + str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='BookLocationCreate',
            message=error_message,
        )


class BookLocationListAPIView(ListAPIView):
    queryset = BookLocation.objects.filter(is_active=True)
    serializer_class = BookLocationSerializer

    def list(self, request, *args, **kwargs):
        try:
            response = super().list(request, *args, **kwargs)
            resdata = response.data

            if resdata:
                responsedata = []

                for item in resdata:
                    OrganizationInstance = Organization.objects.get(id=item.get('organization_id'))
                    BatchInstance = Batch.objects.get(id=item.get('branch_id'))

                    responsedata.append({
                        'id': item.get('id'),
                        'book_location': item.get('book_location'),
                        'book_location_desc': item.get('book_location_desc'),
                        'organization_id': OrganizationInstance.id,
                        'organization_code': OrganizationInstance.organization_code,
                        'batch_id': BatchInstance.id,
                        'batch_description': BatchInstance.batch_description,
                        'is_active': item.get('is_active')
                    })

                return Response({'message': 'Success', 'data': responsedata}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)

        except Exception as e:
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='BookLocationList',
            message=error_message,
        )


class BookLocationUpdateAPIView(UpdateAPIView):
    queryset = BookLocation.objects.all()
    serializer_class = BookLocationSerializer

    def update(self, request, *args, **kwargs):
        try:
            # Get the instance to be updated
            instance = self.get_object()

            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)

            # Get validated data
            booklocation = serializer.validated_data.get('book_location', instance.book_location).upper()
            booklocation_desc = serializer.validated_data.get('book_location_desc', instance.book_location_desc).upper()
            updated_by = serializer.validated_data.get('updated_by')
            organization_id = serializer.validated_data.get('organization_id', instance.organization_id)
            branch_id = serializer.validated_data.get('branch_id', instance.batch_id)
            is_active = serializer.validated_data.get('is_active', instance.is_active)

            # Check if another location with same name exists (excluding current instance)
            if BookLocation.objects.filter(
                    book_location=booklocation,
                    organization_id=organization_id,
                    batch_id=branch_id,
                    is_active=True
            ).exclude(id=instance.id).exists():
                return Response({'message': 'Book Location with this name already exists'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Update the instance
            instance.book_location = booklocation
            instance.book_location_desc = booklocation_desc
            instance.updated_by = updated_by
            instance.is_active = is_active
            instance.save()

            return Response({'message': 'Book Location updated successfully'}, status=status.HTTP_200_OK)

        except BookLocation.DoesNotExist:
            return Response({'error': 'Book Location not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError as e:
            self.log_exception(request, str(e))
            return Response({'error': 'A database error occurred: ' + str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            self.log_exception(request, str(e))
            return Response({'error': 'An unexpected error occurred: ' + str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='BookLocationUpdate',
            message=error_message,
        )


class BookLocationDeleteAPIView(DestroyAPIView):
    queryset = BookLocation.objects.all()
    serializer_class = BookLocationSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()

            # Soft delete - set is_active to False
            instance.is_active = False
            instance.save()

            return Response({'message': 'Book Location deleted successfully'}, status=status.HTTP_200_OK)

        except BookLocation.DoesNotExist:
            return Response({'error': 'Book Location not found'}, status=status.HTTP_404_NOT_FOUND)
        except DatabaseError as e:
            self.log_exception(request, str(e))
            return Response({'error': 'A database error occurred: ' + str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            self.log_exception(request, str(e))
            return Response({'error': 'An unexpected error occurred: ' + str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='BookLocationDelete',
            message=error_message,
        )


class LibraryBookSearchAPIView(ListAPIView):
    queryset = LibraryBook.objects.all()
    serializer_class = LibraryBookSearch

    def list(self, request, *args, **kwargs):
        try:
            academicyearId = request.query_params.get('academic_year_id')
            book_code = request.query_params.get('book_code')
            book_accession_no = request.query_params.get('book_accession_no')
            book_name = request.query_params.get('book_name')
            author = request.query_params.get('author')
            book_categoryId = request.query_params.get('book_category')
            book_sub_categoryId = request.query_params.get('book_sub_category')
            library_branch_Id = request.query_params.get('library_branch')
            locationId = request.query_params.get('location')
            ISBN = request.query_params.get('ISBN')
            typeofbooks = request.query_params.get('typeofbooks')

            if not academicyearId:
                return Response({'message': 'academic year Id need'}, status=status.HTTP_400_BAD_REQUEST)

            filterdata = LibraryBook.objects.filter(academic_year_id=academicyearId, is_active=True)

            finalresponsedata = []
            if filterdata:

                if book_code:
                    filterdata = filterdata.filter(book_code=book_code)

                if book_name:
                    filterdata = filterdata.filter(book_name__icontains=book_name)

                if author:
                    filterdata = filterdata.filter(author__icontains=author)

                if book_categoryId:
                    filterdata = filterdata.filter(book_category=book_categoryId)

                if book_sub_categoryId:
                    filterdata = filterdata.filter(book_sub_category=book_sub_categoryId)

                if ISBN:
                    filterdata = filterdata.filter(ISBN=ISBN)

                if typeofbooks:
                    filterdata = filterdata.filter(type__iexact=typeofbooks)

                # Filter by location if provided
                if locationId:
                    # Use Subquery and OuterRef for advanced filtering
                    barcodes_with_location = LibraryBooksBarcode.objects.filter(
                        locationId=locationId,
                        is_active=True,
                        book=OuterRef('pk')  # Ensure the relationship between the two queries
                    )
                    filterdata = filterdata.filter(pk__in=Subquery(barcodes_with_location.values('book')))

                if book_accession_no:
                    book_with_accession_no = LibraryBooksBarcode.objects.filter(
                        barcode=book_accession_no,
                        is_active=True,
                        book=OuterRef('pk')

                    )
                    filterdata = filterdata.filter(pk__in=Subquery(book_with_accession_no.values('book')))

                if library_branch_Id:
                    filterdata = filterdata.filter(library_branch_id=int(library_branch_Id))

                if filterdata:
                    for item in filterdata:
                        barcodedata = LibraryBooksBarcode.objects.filter(book=item.id, is_active=True)
                        for barcodes in barcodedata:
                            # Safely get library branch info
                            library_branch_id = None
                            library_branch_name = None
                            if item.library_branch_id:
                                try:
                                    library_branch_id = item.library_branch.library_branch_id
                                    library_branch_name = item.library_branch.library_branch_name
                                except LibraryBranch.DoesNotExist:
                                    library_branch_id = None
                                    library_branch_name = None

                            # Safely get location info
                            location_id = None
                            location_name = None
                            if barcodes.location_id_id:
                                try:
                                    location_id = barcodes.location_id.id
                                    location_name = barcodes.location_id.book_location
                                except BookLocation.DoesNotExist:
                                    location_id = None
                                    location_name = None

                            data = {
                                'id': item.id,
                                'book_code': item.book_code,
                                'book_name': item.book_name,
                                'book_categoryId': item.book_category.id,
                                'book_category': item.book_category.category_name,
                                'book_sub_categoryId': item.book_sub_category.id,
                                'book_sub_category': item.book_sub_category.sub_category_name,
                                'library_branch_id': library_branch_id,
                                'library_branch': library_branch_name,
                                'book_status': item.book_status,
                                'no_of_copies': item.no_of_copies,
                                'organization_id': item.organization.id,
                                'organization_code': item.organization.organization_code,
                                'batch_id': item.batch.id,
                                'batch_name': item.batch.batch_code,
                                'publisher': item.publisher,
                                'author': item.author,
                                'publish_year': item.publish_year,
                                'volume': item.volume,
                                'front_cover': item.front_cover if item.front_cover else None,
                                'back_cover': item.back_cover if item.back_cover else None,
                                'edition': item.edition,
                                'pages': item.pages,
                                'bookBarcode': barcodes.barcode,
                                'bookBarcodeId': barcodes.id,
                                'locationId': location_id,
                                'locationName': location_name,
                                'barcode_auto_generated': item.barcode_auto_generated,
                                'ISBN': item.ISBN,
                                'academic_year_id': item.academic_year.id,
                                'academic_year': item.academic_year.academic_year_code,
                                'createdDate': item.createdDate,
                                'allow_issue': item.allow_issue,
                                'type': item.type,
                                'IssueNo': item.IssueNo,
                                'Period': item.Period,
                                'created_at': item.created_at
                            }

                            finalresponsedata.append(data)

                    return Response({'message': 'success', 'data': finalresponsedata}, status=status.HTTP_200_OK)

                else:
                    return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)



        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='BooksearchList',

            message=error_message,

        )


class NextBarcodeNumberListAPIView(ListAPIView):
    queryset = LibraryBooksBarcode.objects.all()
    serializer_class = LibraryBookSerializer

    def list(self, request, *args, **kwargs):
        try:

            # Get the maximum barcode
            max_barcode = LibraryBooksBarcode.objects.aggregate(Max('barcode'))['barcode__max']

            # Calculate the next barcode
            if max_barcode is not None:
                next_barcode = max_barcode + 1
            else:
                # If no barcodes exist, start from a default value (e.g., 1)
                next_barcode = 1

                # Return the next barcode in the response
            return Response(
                {"message": 'success', "next_barcode": next_barcode},
                status=status.HTTP_200_OK
            )


        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='NextbarcodeNo',

            message=error_message,

        )


class GetAllLibraryBranchListAPIView(ListAPIView):
    queryset = LibraryBranch.objects.all()
    serializer_class = LibraryBranchSerializer

    def list(self, request, *args, **kwargs):
        try:
            org_id = self.kwargs.get('org_id')
            branch_id = self.kwargs.get('branch_id')

            # Get library branches for the organization
            # Note: branch_id parameter is not used because LibraryBranch doesn't have
            # an organization branch field - it only has organization and batch
            try:
                libraryBranch_Record = LibraryBranch.objects.filter(
                    organization_id=org_id,
                    is_active=True
                )
            except:
                libraryBranch_Record = None

            finalresponse = []
            if libraryBranch_Record:
                for item in libraryBranch_Record:
                    data = {
                        'library_branch_id': item.library_branch_id,
                        'library_branch_name': item.library_branch_name
                    }

                    finalresponse.append(data)
                return Response({'message': 'success', 'data': finalresponse}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No record found', 'data': []}, status=status.HTTP_200_OK)



        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(

            request=str(request),

            process_name='LibraryBatchList',

            message=error_message,

        )


class LibraryBookCreateAPIView(CreateAPIView):
    queryset = LibraryBook.objects.all()
    serializer_class = LibraryBookCreateSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # Supports JSON & Multipart

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            # Handle multipart/form-data requests
            if request.content_type.startswith('multipart/form-data'):
                data = request.POST.dict()  # Convert QueryDict to a mutable dictionary
                # data = request.data
                data['libraryBookdetails'] = json.loads(data.get('libraryBookdetails', '{}'))  # Convert string to dict
                data['librarypurchesDetails'] = json.loads(
                    data.get('librarypurchesDetails', '[]'))  # Convert string to list
                data['libraryBookBarcodeDetails'] = json.loads(
                    data.get('libraryBookBarcodeDetails', '[]'))  # Convert string to list

                # Attach file fields if present
                if 'front_cover' in request.FILES:
                    data['libraryBookdetails']['front_cover'] = request.FILES['front_cover']
                if 'back_cover' in request.FILES:
                    data['libraryBookdetails']['back_cover'] = request.FILES['back_cover']
            else:
                # Handle application/json requests
                data = request.data
                front_cover = data['libraryBookdetails']['front_cover']
                back_cover = data['libraryBookdetails']['back_cover']
            # Validate data
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)

            # Extract validated data
            libraryBookdetails = serializer.validated_data.get('libraryBookdetails')
            librarypurchesDetails = serializer.validated_data.get('librarypurchesDetails')
            libraryBookBarcodeDetails = serializer.validated_data.get('libraryBookBarcodeDetails')

            # Get instances of related models
            book_category_instance = BookCategory.objects.get(id=libraryBookdetails['book_category_Id'],
                                                              is_active=True)
            book_sub_category_instance = BookSubCategory.objects.get(id=libraryBookdetails['book_sub_category_Id'],
                                                                     is_active=True)

            # Get organization and branch instances first (needed for LibraryBranch creation)
            organization_instance = Organization.objects.get(id=libraryBookdetails['org_id'],
                                                             is_active=True)
            
            # Fetch AcademicYear first to derive the correct Batch
            AcademicYearinstance = AcademicYear.objects.get(id=libraryBookdetails['academicyearId'],
                                                            is_active=True)
            
            # Use the Batch associated with the Academic Year
            branch_instance = AcademicYearinstance.batch

            # Library branch is optional - must exist in database
            Library_branch_instance = None
            if libraryBookdetails.get('library_branch_Id'):
                try:
                    # Get existing LibraryBranch by ID
                    Library_branch_instance = LibraryBranch.objects.get(
                        library_branch_id=libraryBookdetails['library_branch_Id'],
                        is_active=True)
                except LibraryBranch.DoesNotExist:
                    # Return error if library branch doesn't exist
                    return Response(
                        {'message': f"Library Branch with ID {libraryBookdetails['library_branch_Id']} does not exist"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # AcademicYearinstance is already fetched above

            # Save Library Book record
            library_book_instance = LibraryBook.objects.create(
                book_code=libraryBookdetails['book_code'],
                book_name=libraryBookdetails['book_name'],
                book_category=book_category_instance,
                book_sub_category=book_sub_category_instance,
                library_branch=Library_branch_instance,
                book_status=libraryBookdetails.get('book_status'),
                no_of_copies=libraryBookdetails.get('total_no_of_copies'),
                organization=organization_instance,
                batch=branch_instance,
                publisher=libraryBookdetails.get('publisher'),
                author=libraryBookdetails.get('author'),
                publish_year=libraryBookdetails.get('publish_year'),
                volume=libraryBookdetails.get('volume'),
                front_cover=self.save_uploaded_file(libraryBookdetails.get('front_cover')),
                back_cover=self.save_uploaded_file(libraryBookdetails.get('back_cover')),
                edition=libraryBookdetails.get('edition'),
                pages=libraryBookdetails.get('pages'),
                barcode_auto_generated=libraryBookdetails.get('barcode_auto_generated', True),
                ISBN=libraryBookdetails.get('ISBN'),
                academic_year=AcademicYearinstance,
                createdDate=libraryBookdetails.get('createdDate'),
                allow_issue=libraryBookdetails.get('allow_issue'),
                type=libraryBookdetails.get('type'),
                IssueNo=libraryBookdetails.get('IssueNo'),
                Period=libraryBookdetails.get('Period'),
                created_by=libraryBookdetails['loginId'],
                updated_by=libraryBookdetails['loginId']
            )

            # Save Purchase Details
            for purchase_detail in librarypurchesDetails:
                LibraryPurchase.objects.create(
                    purchase_date=purchase_detail['purchase_date'],
                    purchase_from=purchase_detail['purchase_from'],
                    bill_no=purchase_detail['bill_no'],
                    bill_value=purchase_detail['bill_value'],
                    bill_concession=purchase_detail['bill_concession'],
                    no_of_copies=purchase_detail['no_of_copies'],
                    created_by=purchase_detail['created_by'],
                    updated_by=purchase_detail['created_by'],
                    book=library_book_instance
                )

            # Save Barcode Details
            for barcode_detail in libraryBookBarcodeDetails:
                # Location is optional - create if it doesn't exist
                libraryBookLocationInstance = None
                location_id = barcode_detail.get('locationId')
                if location_id and location_id != '':
                    try:
                        libraryBookLocationInstance = BookLocation.objects.get(id=int(location_id), is_active=True)
                    except BookLocation.DoesNotExist:
                        # Auto-create BookLocation if it doesn't exist
                        # Use the requested ID in the name (e.g., "Location 1")
                        location_name = f"Location {location_id}"
                        libraryBookLocationInstance = BookLocation.objects.create(
                            book_location=location_name,
                            book_location_desc=f"Auto-created location {location_id}",
                            organization=organization_instance,
                            batch=branch_instance,
                            is_active=True,
                            created_by=libraryBookdetails.get('loginId', 0)
                        )

                LibraryBooksBarcode.objects.create(
                    barcode=barcode_detail['barcode'],
                    book_barcode_status=barcode_detail.get('book_barcode_status', ''),
                    remarks=barcode_detail.get('remarks', ''),
                    barcode_auto_generated=barcode_detail.get('barcode_auto_generated', True),
                    organization=organization_instance,
                    batch=branch_instance,
                    location_id=libraryBookLocationInstance,
                    created_by=barcode_detail.get('created_by', 0),
                    updated_by=barcode_detail.get('created_by', 0),
                    book=library_book_instance
                )

            return Response({'message': 'Book created successfully'}, status=status.HTTP_201_CREATED)

        except ObjectDoesNotExist as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'An unexpected error occurred: ' + str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def save_uploaded_file(self, file):
        """Helper function to save uploaded files"""
        if not file:
            return None

        folder_name = 'Book_cover'
        unique_string = str(uuid.uuid4())[:8]
        file_name = f"{os.path.splitext(file.name)[0]}_{unique_string}{os.path.splitext(file.name)[-1]}"
        file_path = os.path.join(folder_name, file_name)
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)

        # Ensure the directory exists
        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        # Save the file
        with default_storage.open(full_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        return full_path  # Return full file path


# class LibraryBookCreateAPIView(CreateAPIView):
#     queryset = LibraryBook.objects.all()
#     serializer_class = LibraryBookCreateSerializer
#     parser_classes = [MultiPartParser, FormParser]
#
#     @transaction.atomic
#     def create(self, request, *args, **kwargs):
#         try:
#             # Start a new atomic transaction
#             with transaction.atomic():
#                 # Validate and save data
#                 serializer = self.get_serializer(data=request.data)
#                 serializer.is_valid(raise_exception=True)
#
#                 # Get serialize data
#                 libraryBookdetails = serializer.validated_data.get('libraryBookdetails')
#                 librarypurchesDetails = serializer.validated_data.get('librarypurchesDetails')
#                 libraryBookBarcodeDetails = serializer.validated_data.get('libraryBookBarcodeDetails')
#
#                 #print(libraryBookdetails)
#
#                 # print(libraryBookdetails['book_sub_category_Id'])
#
#                 # print(libraryBookdetails,librarypurchesDetails,libraryBookBarcodeDetails)
#                 #Get Instance
#                 try:
#                     BookcategoryInstance = BookCategory.objects.get(id=libraryBookdetails['book_category_Id'],is_active=True)
#                 except ObjectDoesNotExist:
#                     return Response({'message':'provided book category id not exist'},status=status.HTTP_400_BAD_REQUEST)
#
#                 try:
#                     BookSubcategoryInstance = BookSubCategory.objects.get(id=libraryBookdetails['book_sub_category_Id'],is_active=True)
#                 except ObjectDoesNotExist:
#                     return Response({'message':'provided book subcategory id not exist'},status=status.HTTP_400_BAD_REQUEST)
#
#                 try:
#                     LibraryBranchInstance = LibraryBranch.objects.get(
#                         library_branch_id=libraryBookdetails['library_branch_Id'], is_active=True)
#                 except ObjectDoesNotExist:
#                     return Response({'message': 'provided library branch id not exist'},
#                                     status=status.HTTP_400_BAD_REQUEST)
#
#                 try:
#                     OrganizationInstance = Organization.objects.get(
#                         id=libraryBookdetails['organization_id'], is_active=True)
#                 except ObjectDoesNotExist:
#                     return Response({'message': 'provided organization id not exist'},
#                                     status=status.HTTP_400_BAD_REQUEST)
#
#                 try:
#                     BranchInstance = Batch.objects.get(
#                         id=libraryBookdetails['branch_id'], is_active=True)
#                 except ObjectDoesNotExist:
#                     return Response({'message': 'provided branch id not exist'},
#                                     status=status.HTTP_400_BAD_REQUEST)
#
#
#                 try:
#                     academicyearInstance = Academic_Session_Year.objects.get(
#                         id=libraryBookdetails['academicyearId'], is_active=True)
#                 except ObjectDoesNotExist:
#                     return Response({'message': 'provided academic id not exist'},
#                                     status=status.HTTP_400_BAD_REQUEST)
#
#                 front_page_full_file_path= None
#                 back_page_full_file_path = None
#
#
#                 # Library front cover & back Cover image store if Data in comming
#                 if libraryBookdetails.get('front_cover'):  #['front_cover']:
#
#                     folder_name = 'Book_cover'
#                     unique_string = str(uuid.uuid4())[:8]
#                     front_file_name= f"{os.path.splitext(libraryBookdetails['front_cover'].name)[0]}_{unique_string}{os.path.splitext(libraryBookdetails['front_cover'].name)}"
#                     file_path = os.path.join(folder_name,front_file_name)
#
#                     # Get the full path relative to the midea directory
#                     front_page_full_file_path = os.path.join(settings.MEDIA_ROOT,file_path)
#
#                     # Ensure the directory exists
#                     if not os.path.exists(os.path.dirname(front_page_full_file_path)):
#                         os.makedirs(os.path.dirname(front_page_full_file_path))
#
#                     # Save the file
#                     with default_storage.open(front_page_full_file_path, 'wb+') as destination:
#                         for chunk in libraryBookdetails['front_cover'].chunks():
#                             destination.write(chunk)
#
#                 if libraryBookdetails['back_cover']:
#                     folder_name = 'Book_cover'
#                     unique_string = str(uuid.uuid4())[:8]
#                     back_file_name = f"{os.path.splitext(libraryBookdetails['back_cover'].name)[0]}_{unique_string}{os.path.splitext(libraryBookdetails['back_cover'].name)}"
#                     file_path = os.path.join(folder_name, back_file_name)
#
#                     # Get the full path relative to the midea directory
#                     back_page_full_file_path = os.path.join(settings.MEDIA_ROOT, file_path)
#
#                     # Ensure the directory exists
#                     if not os.path.exists(os.path.dirname(back_page_full_file_path)):
#                         os.makedirs(os.path.dirname(back_page_full_file_path))
#
#                     # Save the file
#                     with default_storage.open(back_page_full_file_path, 'wb+') as destination:
#                         for chunk in libraryBookdetails['back_cover'].chunks():
#                             destination.write(chunk)
#
#                 # print(back_page_full_file_path)
#                 # Insert Record Into LibraryBook DB
#                 library_LibraryBookInstance= LibraryBook.objects.create(
#                     book_code=libraryBookdetails['book_code'],
#                     book_name=libraryBookdetails['book_name'],
#                     book_category= BookcategoryInstance,
#                     book_sub_category = BookSubcategoryInstance,
#                     library_branch_id = LibraryBranchInstance,
#                     book_status = libraryBookdetails['book_status'],
#                     no_of_copies = libraryBookdetails['total_no_of_copies'],
#                     organization_id =OrganizationInstance,
#                     branch_id=BranchInstance,
#                     publisher=libraryBookdetails['publisher'],
#                     author = libraryBookdetails['author'],
#                     publish_year = libraryBookdetails['publish_year'],
#                     volume = libraryBookdetails['volume'],
#                     front_cover= front_page_full_file_path if front_page_full_file_path else None,
#                     back_cover = back_page_full_file_path if back_page_full_file_path else None,
#                     edition = libraryBookdetails['edition'],
#                     pages = libraryBookdetails['pages'],
#                     barcode_auto_generated = libraryBookdetails['barcode_auto_generated'],
#                     ISBN = libraryBookdetails['ISBN'],
#                     academic_year_id = academicyearInstance,
#                     createdDate = libraryBookdetails['createdDate'],
#                     allow_issue = libraryBookdetails['allow_issue'],
#                     type = libraryBookdetails['type'],
#                     IssueNo = libraryBookdetails['IssueNo'],
#                     Period = libraryBookdetails['Period'],
#                     created_by = libraryBookdetails['loginId'],
#                     updated_by = libraryBookdetails['loginId']
#
#
#                 )
#
#             # Insert record into Sch_LibraryPurchase DB
#             # Retrive Record
#
#             for item in librarypurchesDetails:
#
#                 Sch_LibraryPurchaseInstance = Sch_LibraryPurchase.objects.create(
#                     book=library_LibraryBookInstance,
#                     purchase_date = item['purchase_date'],
#                     purchase_from =item['purchase_from'],
#                     bill_no= item['bill_no'],
#                     bill_value = item['bill_value'],
#                     bill_concession = item['bill_concession'],
#                     no_of_copies = item['no_of_copies'],
#                     created_by = item['created_by'],
#                     updated_by= item['created_by'],
#
#
#                 )
#
#             # Insert record into LibraryBooksBarcode DB
#
#
#             # Iterate the Record
#             for item in libraryBookBarcodeDetails:
#                 try:
#                     locationInstance = BookLocation.objects.get(
#                         id=item['locationId'].id, is_active=True)
#                 except ObjectDoesNotExist:
#                     return Response({'message': 'provided location id not exist'},
#                                     status=status.HTTP_400_BAD_REQUEST)
#
#                 # Check if the barcode already exists
#                 if LibraryBooksBarcode.objects.filter(barcode=item['barcode']).exists():
#                     return Response({'message': f"Barcode No '{item['barcode']}' already exists."},
#                                     status=status.HTTP_400_BAD_REQUEST)
#
#                 LibraryBooksBarcodeInstance = LibraryBooksBarcode.objects.create(
#                     book = library_LibraryBookInstance,
#                     barcode = item['barcode'],
#                     book_barcode_status = item['book_barcode_status'],
#                     remarks = item['remarks'],
#                     barcode_auto_generated = item['barcode_auto_generated'],
#                     organization_id = item['organization_id'],
#                     branch_id = item['branch_id'],
#                     locationId = locationInstance,
#                     created_by = item['created_by'],
#                     updated_by = item['created_by']
#                 )
#
#             return Response({'message':'Book created success'},status=status.HTTP_200_OK)
#
#         except ValidationError as e:
#
#             # Rollback the transaction on validation error
#
#             return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
#
#         except ValueError as e:
#             # Catch the ValueError and return 400 Bad Request
#             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
#
#
#
#         except DatabaseError as e:
#
#             # Rollback the transaction on database error
#
#             self.log_exception(request, str(e))
#
#             return Response({'error': 'A database error occurred: ' + str(e)},
#
#                             status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#
#
#         except Exception as e:
#
#             # Rollback the transaction on any other exception
#
#             self.log_exception(request, str(e))
#
#             return Response({'error': 'An unexpected error occurred: ' + str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#     def log_exception(self, request, error_message):
#
#         ExceptionTrack.objects.create(
#
#             request=str(request),
#
#             process_name='LibraryBookCreate',
#
#             message=error_message,
#
#         )

class GetAllLibraryLocationListAPIView(ListAPIView):
    queryset = BookLocation.objects.all()
    serializer_class = BookLocationSerializer

    def list(self, request, *args, **kwargs):
        try:
            org_id = self.kwargs.get('org_id')
            branch_id = self.kwargs.get('branch_id')

            # Get library location based on org and branch
            try:
                library_location_record = BookLocation.objects.filter(organization_id=org_id, batch_id=branch_id,
                                                                      is_active=True)
            except:
                library_location_record = None

            finalresponse = []
            if library_location_record:
                for item in library_location_record:
                    data = {
                        'id': item.id,
                        'booklocation': item.book_location,
                        'booklocation_desc': item.book_location_desc,
                    }

                    finalresponse.append(data)
                return Response({'message': 'success', 'data': finalresponse}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No record found', 'data': []}, status=status.HTTP_200_OK)



        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(

            request=str(request),

            process_name='LibrarybooklocationList',

            message=error_message,

        )


class GetLibraryBookBasedOnIdAPIView(ListAPIView):
    serializer_class = LibraryBookSerializer

    def list(self, request, *args, **kwargs):
        try:
            bookId = self.kwargs.get('bookId')
            try:
                LibrarybookInstance = LibraryBook.objects.get(id=bookId, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Provided book does not exist'}, status=status.HTTP_404_NOT_FOUND)

            try:
                LibraryPurchaseRecord = LibraryPurchase.objects.filter(book=bookId, is_active=True)
            except:
                LibraryPurchaseRecord = []

            try:
                LibraryBooksBarcodeRecord = LibraryBooksBarcode.objects.filter(book=bookId, is_active=True)
            except:
                LibraryBooksBarcodeRecord = []

            bookdetails = []
            purchesdetails = []
            barcode_location_details = []

            # Helper function to get file details
            def get_file_details(file_field):
                """Return type, path, and binary data of the given file field."""
                if not file_field:  # If the field is empty
                    return None

                file_path = file_field.path if hasattr(file_field, 'path') else file_field  # Handle string case
                file_url = file_field.url if hasattr(file_field, 'url') else file_field  # Handle string case
                file_type, _ = mimetypes.guess_type(file_path)  # Determine MIME type

                if os.path.exists(file_path):  # Ensure file exists
                    with open(file_path, "rb") as image_file:
                        binary_data = base64.b64encode(image_file.read()).decode("utf-8")  # Encode to Base64

                    return {
                        "type": file_type if file_type else "unknown",
                        "path": file_url,  # Return file URL
                        "binary_data": binary_data  # Base64 encoded binary data
                    }

                return None  # Return None if file does not exist

            # Retrieve Record from LibraryBook
            # Safely get library branch info
            library_branch_id = None
            library_branch_name = None
            if LibrarybookInstance.library_branch_id:
                try:
                    library_branch_id = LibrarybookInstance.library_branch.library_branch_id
                    library_branch_name = LibrarybookInstance.library_branch.library_branch_name
                except LibraryBranch.DoesNotExist:
                    library_branch_id = None
                    library_branch_name = None

            book_data = {
                'id': LibrarybookInstance.id,
                'book_code': LibrarybookInstance.book_code,
                'book_name': LibrarybookInstance.book_name,
                'book_categoryId': LibrarybookInstance.book_category.id,
                'book_category': LibrarybookInstance.book_category.category_name,
                'book_subcategoryId': LibrarybookInstance.book_sub_category.id,
                'book_sub_category': LibrarybookInstance.book_sub_category.sub_category_name,
                'library_branch_id': library_branch_id,
                'library_branch': library_branch_name,
                'book_status': LibrarybookInstance.book_status,
                'no_of_copies': LibrarybookInstance.no_of_copies,
                'organization_id': LibrarybookInstance.organization.id,
                'OrganizationName': LibrarybookInstance.organization.organization_code,
                'batch_id': LibrarybookInstance.batch.id,
                'batch_name': LibrarybookInstance.batch.batch_code,
                'publisher': LibrarybookInstance.publisher,
                'author': LibrarybookInstance.author,
                'publish_year': LibrarybookInstance.publish_year,
                'volume': LibrarybookInstance.volume,
                'front_cover': get_file_details(LibrarybookInstance.front_cover),
                'back_cover': get_file_details(LibrarybookInstance.back_cover),
                'edition': LibrarybookInstance.edition,
                'pages': LibrarybookInstance.pages,
                'barcode_auto_generated': LibrarybookInstance.barcode_auto_generated,
                'ISBN': LibrarybookInstance.ISBN,
                'academic_year_id': LibrarybookInstance.academic_year.id,
                'academic_year': LibrarybookInstance.academic_year.academic_year_code,
                'createdDate': LibrarybookInstance.createdDate,
                'allow_issue': LibrarybookInstance.allow_issue,
                'type': LibrarybookInstance.type,
                'IssueNo': LibrarybookInstance.IssueNo,
                'Period': LibrarybookInstance.Period
            }

            bookdetails.append(book_data)

            # Retrieve Purchase Records
            for item in LibraryPurchaseRecord:
                purches_data = {
                    'id': item.id,
                    'book': item.book.id,
                    'bookname': item.book.book_name,
                    'purchase_date': item.purchase_date,
                    'purchase_from': item.purchase_from,
                    'bill_no': item.bill_no,
                    'bill_value': item.bill_value,
                    'bill_concession': item.bill_concession,
                    'no_of_copies': item.no_of_copies
                }
                purchesdetails.append(purches_data)

            # Retrieve LibraryBooksBarcode Records
            for item in LibraryBooksBarcodeRecord:
                barcode_location_data = {
                    'id': item.id,
                    'book': item.book.id,
                    'bookname': item.book.book_name,
                    'barcode': item.barcode,
                    'book_barcode_status': item.book_barcode_status,
                    'remarks': item.remarks,
                    'barcode_auto_generated': item.barcode_auto_generated,
                    'organization_id': item.organization.id,
                    'organizationName': item.organization.organization_code,
                    'branch_id': item.batch.id,
                    'branchName': item.batch.batch_code,
                    'locationId': item.location_id.id if item.location_id else None,
                    'booklocation': item.location_id.book_location if item.location_id else None
                }
                barcode_location_details.append(barcode_location_data)

            # Prepare Final Response
            finalResponsedata = {
                'bookDetails': bookdetails,
                'purchesDetails': purchesdetails,
                'BarcodeLocationDetails': barcode_location_details
            }

            return Response({'message': 'success', 'data': finalResponsedata}, status=status.HTTP_200_OK)

        except Exception as e:
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='LibrarybookDetails',
            message=error_message,
        )


# class GetLibraryBookBasedOnIdAPIView(ListAPIView):
#     # queryset =LibraryBook.objects.all()
#     serializer_class = LibraryBookSerializer
#
#     def list(self, request, *args, **kwargs):
#         try:
#             book= self.kwargs.get('book')
#             try:
#                 LibrarybookInstance = LibraryBook.objects.get(id=book,is_active=True)
#             except ObjectDoesNotExist:
#                 return Response({'message':'provided book not exist'},status=status.HTTP_404_NOT_FOUND)
#
#             try:
#                 LibraryPurchaseRecord = Sch_LibraryPurchase.objects.filter(book=book,is_active=True)
#             except:
#                 LibraryPurchaseRecord=[]
#
#             try:
#                 LibraryBooksBarcodeRecord = LibraryBooksBarcode.objects.filter(book=book,is_active=True)
#             except:
#                 LibraryBooksBarcodeRecord=[]
#
#             bookdetails=[]
#             purchesdetails=[]
#             barcode_location_details=[]
#
#             # Retrive Record Into LibraryBook
#             book_data={
#                 'id':LibrarybookInstance.id,
#                 'book_code': LibrarybookInstance.book_code,
#                 'book_name': LibrarybookInstance.book_name,
#                 'book_categoryId':LibrarybookInstance.book_category.id,
#                 'book_category': LibrarybookInstance.book_category.category_name,
#                 'book_subcategoryId': LibrarybookInstance.book_sub_category.id,
#                 'book_sub_category': LibrarybookInstance.book_sub_category.sub_category_name,
#                 'library_branch_id': LibrarybookInstance.library_branch_id.library_branch_id,
#                 'library_branch': LibrarybookInstance.library_branch_id.library_branch_name,
#                 'book_status': LibrarybookInstance.book_status,
#                 'no_of_copies': LibrarybookInstance.no_of_copies,
#                 'organization_id':LibrarybookInstance.organization_id.id,
#                 'OrganizationName': LibrarybookInstance.organization_id.organization_code,
#                 'branch_id': LibrarybookInstance.branch_id.id,
#                 'branchName': LibrarybookInstance.branch_id.batch_code,
#                 'publisher': LibrarybookInstance.publisher,
#                 'author': LibrarybookInstance.author,
#                 'publish_year': LibrarybookInstance.publish_year,
#                 'volume': LibrarybookInstance.volume,
#                 'front_cover': LibrarybookInstance.front_cover if LibrarybookInstance.front_cover else None,
#                 'back_cover': LibrarybookInstance.back_cover if LibrarybookInstance.back_cover else None,
#                 'edition': LibrarybookInstance.edition,
#                 'pages': LibrarybookInstance.pages,
#                 'barcode_auto_generated': LibrarybookInstance.barcode_auto_generated,
#                 'ISBN': LibrarybookInstance.ISBN,
#                 'academicyearId': LibrarybookInstance.academic_year_id.id,
#                 'academicyear': LibrarybookInstance.academic_year_id.sesion_code,
#                 'createdDate': LibrarybookInstance.createdDate,
#                 'allow_issue': LibrarybookInstance.allow_issue,
#                 'type': LibrarybookInstance.type,
#                 'IssueNo': LibrarybookInstance.IssueNo,
#                 'Period': LibrarybookInstance.Period
#             }
#
#             bookdetails.append(book_data)
#
#             # Retrive Purches record
#             if LibraryPurchaseRecord:
#                 for item in LibraryPurchaseRecord:
#                     purches_data={
#                         'id': item.id,
#                         'book': item.book.id,
#                         'bookname': item.book.book_name,
#                         'purchase_date': item.purchase_date,
#                         'purchase_from': item.purchase_from,
#                         'bill_no': item.bill_no,
#                         'bill_value': item.bill_value,
#                         'bill_concession': item.bill_concession,
#                         'no_of_copies': item.no_of_copies
#                     }
#
#                     purchesdetails.append(purches_data)
#
#             # Retrive LibraryBooksBarcode
#             if LibraryBooksBarcodeRecord:
#
#                 for item in LibraryBooksBarcodeRecord:
#                     barcode_location_data={
#                         'id':item.id,
#                         'book': item.book.id,
#                         'bookname': item.book.book_name,
#                         'barcode': item.barcode,
#                         'book_barcode_status': item.book_barcode_status,
#                         'remarks': item.remarks,
#                         'barcode_auto_generated': item.barcode_auto_generated,
#                         'organization_id': item.organization_id.id,
#                         'organizationName': item.organization_id.organization_code,
#                         'branch_id': item.branch_id.id,
#                         'branchName': item.branch_id.batch_code,
#                         'locationId': item.locationId.id,
#                         'booklocation': item.locationId.booklocation
#                     }
#
#                     barcode_location_details.append(barcode_location_data)
#
#             # make response
#             finalResponsedata={
#                 'bookDetails': bookdetails,
#                 'purchesDetails':purchesdetails,
#                 'BarcodeLocationDetails':barcode_location_details
#             }
#
#
#             return Response({'message':'success','data':finalResponsedata},status=status.HTTP_200_OK)
#
#         except Exception as e:
#
#             # Log the exception
#
#             error_message = str(e)
#
#             self.log_exception(request, error_message)
#
#             return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#     def log_exception(self, request, error_message):
#         ExceptionTrack.objects.create(
#
#             request=str(request),
#
#             process_name='LibrarybookDetails',
#
#             message=error_message,
#
#         )

class LibraryBookUpdateAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # Supports JSON & Multipart

    @transaction.atomic
    def put(self, request, *args, **kwargs):
        try:
            if request.content_type.startswith('multipart/form-data'):
                data = request.POST.dict()  # Convert QueryDict to a mutable dictionary
                data['libraryBookdetails'] = json.loads(data.get('libraryBookdetails', '{}'))  # Convert string to dict
                data['librarypurchesDetails'] = json.loads(
                    data.get('librarypurchesDetails', '[]'))  # Convert string to list
                data['libraryBookBarcodeDetails'] = json.loads(
                    data.get('libraryBookBarcodeDetails', '[]'))  # Convert string to list

                # Attach file fields if present
                if 'front_cover' in request.FILES:
                    data['libraryBookdetails']['front_cover'] = request.FILES['front_cover']
                if 'back_cover' in request.FILES:
                    data['libraryBookdetails']['back_cover'] = request.FILES['back_cover']
        except Exception as e:
            print(e)
            return Response({'message': str(e)}, status=status.HTTP_404_NOT_FOUND)

        try:
            # # Get data from request
            libraryBookdetails = data['libraryBookdetails']  # request.data.get('libraryBookdetails')
            librarypurchesDetails = data['librarypurchesDetails']  # request.data.get('librarypurchesDetails')
            libraryBookBarcodeDetails = data[
                'libraryBookBarcodeDetails']  # request.data.get('libraryBookBarcodeDetails')
            # #print(libraryBookdetails,librarypurchesDetails,libraryBookBarcodeDetails)

            # Get Book Details
            # Get Instance
            try:
                bookcategoryInstance = BookCategory.objects.get(id=libraryBookdetails.get('book_category_Id'),
                                                                is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'provided book category not exist'}, status=status.HTTP_404_NOT_FOUND)

            try:
                booksubcategoryInstance = BookSubCategory.objects.get(
                    id=libraryBookdetails.get('book_sub_category_Id'),
                    is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'provided book subcategory not exist'}, status=status.HTTP_404_NOT_FOUND)

            try:
                academicyearInstance = AcademicYear.objects.get(id=libraryBookdetails.get('academicyearId'),
                                                                is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'provided academic year Id not exist'}, status=status.HTTP_404_NOT_FOUND)

            # Derive branchInstance (Batch) from AcademicYear
            branchInstance = academicyearInstance.batch

            try:
                organizationInstance = Organization.objects.get(id=libraryBookdetails.get('org_id'),
                                                                is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'provided organization Id not exist'}, status=status.HTTP_404_NOT_FOUND)

            # branchInstance will be derived from AcademicYear below

            try:
                bookInstance = LibraryBook.objects.get(id=libraryBookdetails.get('bookId'),
                                                       is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'provided Book Id not exist'}, status=status.HTTP_404_NOT_FOUND)

            # Library branch is optional - must exist in database
            librarybranchInstance = None
            if libraryBookdetails.get('library_branch_Id'):
                try:
                    # Get existing LibraryBranch by ID
                    librarybranchInstance = LibraryBranch.objects.get(
                        library_branch_id=libraryBookdetails.get('library_branch_Id'),
                        is_active=True)
                except ObjectDoesNotExist:
                    # Return error if library branch doesn't exist
                    return Response(
                        {'message': f"Library Branch with ID {libraryBookdetails.get('library_branch_Id')} does not exist"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # update the book details

            bookInstance.book_code = libraryBookdetails.get('book_code')
            bookInstance.book_name = libraryBookdetails.get('book_name')
            bookInstance.book_category = bookcategoryInstance
            bookInstance.book_sub_category = booksubcategoryInstance
            bookInstance.library_branch = librarybranchInstance
            bookInstance.book_status = libraryBookdetails.get('book_status')
            bookInstance.no_of_copies = libraryBookdetails.get('no_of_copies')
            bookInstance.organization = organizationInstance
            bookInstance.batch = branchInstance
            bookInstance.publisher = libraryBookdetails.get('publisher')
            bookInstance.author = libraryBookdetails.get('author')
            bookInstance.publish_year = libraryBookdetails.get('publish_year')
            bookInstance.volume = libraryBookdetails.get('volume')
            bookInstance.front_cover = libraryBookdetails.get('front_cover') if libraryBookdetails.get(
                'front_cover') else None
            bookInstance.back_cover = libraryBookdetails.get('back_cover') if libraryBookdetails.get(
                'back_cover') else None
            bookInstance.edition = libraryBookdetails.get('edition')
            bookInstance.pages = libraryBookdetails.get('pages')
            # bookInstance.barcode_auto_generated = libraryBookBarcodeDetails.get('barcode_auto_generated')
            bookInstance.ISBN = libraryBookdetails.get('ISBN')
            bookInstance.academic_year = academicyearInstance
            bookInstance.createdDate = libraryBookdetails.get('createdDate')
            bookInstance.allow_issue = libraryBookdetails.get('allow_issue')
            bookInstance.type = libraryBookdetails.get('type')
            bookInstance.IssueNo = libraryBookdetails.get('IssueNo')
            bookInstance.Period = libraryBookdetails.get('Period')
            bookInstance.updated_by = libraryBookdetails.get('loginId')
            bookInstance.save()

            # create and update purches record

            for item in librarypurchesDetails:

                if item.get('id') > 0:
                    try:
                        librarypurchesInstance = LibraryPurchase.objects.get(id=item.get('id'), is_active=True)
                    except ObjectDoesNotExist:
                        return Response({'message': 'provided library book purches Id not exist'},
                                        status=status.HTTP_404_NOT_FOUND)

                    # update the Purches record

                    librarypurchesInstance.book = bookInstance
                    librarypurchesInstance.purchase_date = item.get('purchase_date')
                    librarypurchesInstance.purchase_from = item.get('purchase_from')
                    librarypurchesInstance.bill_no = item.get('bill_no')
                    librarypurchesInstance.bill_value = item.get('bill_value')
                    librarypurchesInstance.bill_concession = item.get('bill_concession')
                    librarypurchesInstance.no_of_copies = item.get('no_of_copies')
                    librarypurchesInstance.updated_by = item.get('updated_by')

                    librarypurchesInstance.save()

                elif item.get('id') == 0:
                    # create purches record
                    libraryPurchesInstance = LibraryPurchase.objects.create(
                        book=bookInstance,
                        purchase_date=item.get('purchase_date'),
                        purchase_from=item.get('purchase_from'),
                        bill_no=item.get('bill_no'),
                        bill_value=item.get('bill_value'),
                        bill_concession=item.get('bill_concession'),
                        no_of_copies=item.get('no_of_copies'),
                        created_by=item.get('updated_by'),
                        updated_by=item.get('updated_by')

                    )

            # create and update LibraryBooksBarcode Details

            for item in libraryBookBarcodeDetails:
                # print(item)
                # Book location Instance (optional) - create if it doesn't exist
                booklocationInstance = None
                if item.get('locationId'):
                    try:
                        booklocationInstance = BookLocation.objects.get(id=item.get('locationId'), is_active=True)
                    except ObjectDoesNotExist:
                        # Auto-create BookLocation if it doesn't exist
                        # Use the requested ID in the name (e.g., "Location 1")
                        location_name = f"Location {item.get('locationId')}"
                        booklocationInstance = BookLocation.objects.create(
                            book_location=location_name,
                            book_location_desc=f"Auto-created location {item.get('locationId')}",
                            organization=organizationInstance,
                            batch=branchInstance,
                            is_active=True,
                            created_by=libraryBookdetails.get('loginId', 0)
                        )
                # print(booklocationInstance)

                # library book location Instance
                # Check if this is an update (ID exists in database) or create (ID doesn't exist or is 0/None)
                barcodedetailsInstance = None
                if item.get('id') and item.get('id') > 0:
                    # library barcode details Instance - try to get existing record
                    try:
                        barcodedetailsInstance = LibraryBooksBarcode.objects.get(id=item.get('id'), is_active=True)
                    except ObjectDoesNotExist:
                        # ID doesn't exist in database (e.g., timestamp ID from frontend)
                        # Treat it as a new record
                        barcodedetailsInstance = None

                # Update existing barcode record
                if barcodedetailsInstance:
                    barcodedetailsInstance.book = bookInstance
                    barcodedetailsInstance.barcode = item.get('barcode')
                    barcodedetailsInstance.book_barcode_status = item.get('book_barcode_status')
                    barcodedetailsInstance.remarks = item.get('remarks')
                    barcodedetailsInstance.barcode_auto_generated = item.get('barcode_auto_generated')
                    barcodedetailsInstance.organization = organizationInstance
                    barcodedetailsInstance.batch = branchInstance
                    barcodedetailsInstance.location_id = booklocationInstance
                    barcodedetailsInstance.updated_by = item.get('updated_by')
                    barcodedetailsInstance.save()

                # Create new barcode record
                elif item.get('id') == 0 or item.get('id') is None or not barcodedetailsInstance:
                    # create barcode record

                    # Check if the barcode already exists
                    if LibraryBooksBarcode.objects.filter(barcode=item['barcode']).exists():
                        return Response({'message': f"Barcode No '{item['barcode']}' already exists."},
                                        status=status.HTTP_400_BAD_REQUEST)

                    barcodecreateInstance = LibraryBooksBarcode.objects.create(
                        book=bookInstance,
                        barcode=item.get('barcode'),
                        book_barcode_status=item.get('book_barcode_status'),
                        remarks=item.get('remarks'),
                        barcode_auto_generated=item.get('barcode_auto_generated', True),
                        organization=organizationInstance,
                        batch=branchInstance,
                        location_id=booklocationInstance,
                        created_by=item.get('created_by', 0),
                        updated_by=item.get('updated_by', 0)
                    )
            return Response({'message': 'success'}, status=status.HTTP_200_OK)


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

            process_name='LibraryBookUpdate',

            message=error_message,

        )


class BooksAvailableforIssues(ListAPIView):
    # queryset = LibraryBooksBarcode.objects.all()
    serializer_class = BookDetailsListSerializer

    def list(self, request, *args, **kwargs):
        try:
            barcodeId = self.request.query_params.get('barcodeId')
            barcodeNo = self.request.query_params.get('barcodeNo')

            filterdata = LibraryBooksBarcode.objects.filter(is_active=True)

            # Retrieve book_detail_ids of books that are issued but not returned
            issued_but_not_returned_ids = LibraryBooksIssues.objects.filter(
                return_date__isnull=True
            ).values_list('book_detail_id', flat=True)

            # Exclude those book IDs from filterdata
            filterdata = filterdata.exclude(id__in=issued_but_not_returned_ids)

            if filterdata:

                if barcodeId:
                    filterdata = filterdata.filter(id=barcodeId, is_active=True)

                if barcodeNo:
                    filterdata = filterdata.filter(barcode=barcodeNo, is_active=True)

                if filterdata:
                    responsedata = []
                    for item in filterdata:
                        data = {
                            'id': item.id,
                            'barcode': item.barcode,
                            'bookName': item.book.book_name,
                            'bookCode': item.book.book_code,
                            'categoryId': item.book.book_category.id,
                            'categoryName': item.book.book_category.category_name,
                            'subcategoryId': item.book.book_sub_category.id,
                            'subcategoryName': item.book.book_sub_category.sub_category_name,

                        }

                        responsedata.append(data)

                    return Response({'message': 'success', 'data': responsedata}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)


        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='LibrarybookDetails',

            message=error_message,

        )


class BookIssuesCreateAPIView(CreateAPIView):
    serializer_class = BookIssuesSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)

                # Get serializer data (use snake_case to match serializer field names)
                academicyearId = serializer.validated_data.get('academic_year_id')
                staffId = serializer.validated_data.get('staff_id')
                studentId = serializer.validated_data.get('student_id')
                issueDate = serializer.validated_data.get('issue_date')
                issuesBookDetails = serializer.validated_data.get('issues_book_details')
                created_by = serializer.validated_data.get('created_by')

                academicyearInstance = AcademicYear.objects.get(id=academicyearId, is_active=True)

                # Check that both staff and student are not selected at the same time
                if staffId and studentId:
                    return Response({'message': 'You cannot select both staff and student at a time.'},
                                    status=status.HTTP_400_BAD_REQUEST)

                # Check that at least one of staff or student is selected
                if not staffId and not studentId:
                    return Response({'message': 'Please select either a student or a teacher to issue books.'},
                                    status=status.HTTP_400_BAD_REQUEST)

                # Initialize max_book_issue_allowed
                max_book_issue_allowed = 0

                # Check student book issue limit
                if studentId:
                    # Count books already issued to this student (not yet returned)
                    studentBookInstance = LibraryBooksIssues.objects.filter(
                        student=studentId,
                        academic_year=academicyearInstance,
                        return_date__isnull=True,
                        is_active=True
                    )
                    previous_assigned_books = studentBookInstance.count()
                    MAX_BOOKS_ISSUED_STUDENT_INSTANCE = ParameterValue.objects.get(
                        parameter_name="MAX_BOOKS_ISSUED_STUDENT", is_active=True)
                    max_book_issue_allowed = int(MAX_BOOKS_ISSUED_STUDENT_INSTANCE.org_value)
                    if previous_assigned_books >= max_book_issue_allowed:
                        return Response(
                            {'error': f'Student has reached the book issue limit ({max_book_issue_allowed} books).'},
                            status=status.HTTP_400_BAD_REQUEST)

                # Check staff book issue limit
                if staffId:
                    # Count books already issued to this staff (not yet returned)
                    staffBookInstance = LibraryBooksIssues.objects.filter(
                        professor=staffId,
                        academic_year=academicyearInstance,
                        return_date__isnull=True,
                        is_active=True
                    )
                    previous_assigned_books = staffBookInstance.count()
                    MAX_BOOKS_ISSUED_TEACHER_INSTANCE = ParameterValue.objects.get(
                        parameter_name="MAX_BOOKS_ISSUED_TEACHER", is_active=True)
                    max_book_issue_allowed = int(MAX_BOOKS_ISSUED_TEACHER_INSTANCE.org_value)
                    if previous_assigned_books >= max_book_issue_allowed:
                        return Response(
                            {'error': f'Teacher has reached the book issue limit ({max_book_issue_allowed} books).'},
                            status=status.HTTP_400_BAD_REQUEST)

                if issuesBookDetails and len(issuesBookDetails) <= int(max_book_issue_allowed):
                    for book_barcode_id in issuesBookDetails:
                        # Lookup by id (primary key), not barcode number
                        BookbarcodeInstance = LibraryBooksBarcode.objects.get(id=book_barcode_id, is_active=True)

                        SCHLIBRARYBOOKSISSUESINSTANCE = LibraryBooksIssues.objects.create(
                            student_id=studentId,
                            professor_id=staffId,
                            book_detail=BookbarcodeInstance,
                            issue_date=issueDate,
                            academic_year=academicyearInstance,
                            issued_by=created_by
                        )

                        # Update book barcode status to 'Issued'
                        BookbarcodeInstance.book_barcode_status = 'Issued'
                        BookbarcodeInstance.save()
                else:
                    return Response({'error': f'You cannot issue more book than issue limit.'},
                                    status=status.HTTP_400_BAD_REQUEST)

                return Response({'message': 'success'}, status=status.HTTP_200_OK)


        except ValidationError as e:

            # Rollback the transaction on validation error

            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)


        except ValueError as e:

            # Catch the ValueError and return 400 Bad Request

            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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

        ExceptionTrack.objects.create(

            request=str(request)[:100],

            process_name='LibraryBookIssues',

            message=str(error_message)[:200],

        )


class BookIssuesSearchListAPIView(ListAPIView):
    queryset = LibraryBooksIssues.objects.all()
    serializer_class = IssuesBookSearchSerializer

    def list(self, request, *args, **kwargs):
        try:
            academic_year_id = request.query_params.get('academic_year_id')
            professor_id = request.query_params.get('professor_id')
            student_id = request.query_params.get('student_id')
            course_id = request.query_params.get('course_id')
            semester_id = request.query_params.get('semester_id')
            section_id = request.query_params.get('section_id')
            book_title = request.query_params.get('book_title')
            category_id = request.query_params.get('category_id')
            subcategory_id = request.query_params.get('subcategory_id')
            issue_date = request.query_params.get('issue_date')
            return_date = request.query_params.get('return_date')
            book_barcode_no = request.query_params.get('book_barcode_no')
            flag = request.query_params.get('flag')

            if not flag:
                return Response({'message': 'please provide flag value'},
                                status=status.HTTP_400_BAD_REQUEST)

            if professor_id and student_id:
                return Response({'message': 'you can not choose both professor and student'})

            # Start with all active issues, then optionally filter by academic year
            filterdata = LibraryBooksIssues.objects.filter(is_active=True)
            
            # If academic_year_id is provided and valid, filter by it
            if academic_year_id:
                # Check if academic year exists and has records
                academic_year_exists = AcademicYear.objects.filter(id=academic_year_id).exists()
                if academic_year_exists:
                    filtered_by_year = filterdata.filter(academic_year=academic_year_id)
                    # Only apply the filter if it returns results
                    if filtered_by_year.exists():
                        filterdata = filtered_by_year

            if professor_id:
                filterdata = filterdata.filter(professor=professor_id)

            if student_id:
                filterdata = filterdata.filter(student=student_id)

            if course_id:
                students = StudentCourse.objects.filter(
                    course=course_id, is_active=True
                ).values_list('student', flat=True)

                filterdata = filterdata.filter(student__in=students)

            if section_id:
                students = StudentCourse.objects.filter(
                    course=course_id, section=section_id, is_active=True
                ).values_list('student', flat=True)

                filterdata = filterdata.filter(student__in=students)

            # If book_title is provided, filter the book table and get book_ids
            if book_title:
                book_ids = LibraryBook.objects.filter(
                    book_name__icontains=book_title,
                    is_active=True
                ).values_list('id', flat=True)

                # Use book_ids to filter the LibraryBooksBarcode table
                barcode_ids = LibraryBooksBarcode.objects.filter(
                    book__in=book_ids,
                    is_active=True  # Optionally ensure the barcode records are active
                ).values_list('id', flat=True)

                # Convert barcode_ids QuerySet to a list (optional)
                barcode_id_list = list(barcode_ids)

                filterdata = filterdata.filter(book_detail__in=barcode_id_list)

            if category_id:
                book_ids_categorywise = LibraryBook.objects.filter(book_category=category_id,
                                                                   is_active=True).values_list('id', flat=True)

                # Use book_ids to filter the LibraryBooksBarcode table
                barcode_ids = LibraryBooksBarcode.objects.filter(
                    book__in=book_ids_categorywise,
                    is_active=True  # Optionally ensure the barcode records are active
                ).values_list('id', flat=True)

                # Convert barcode_ids QuerySet to a list (optional)
                barcode_id_list = list(barcode_ids)

                filterdata = filterdata.filter(book_detail_id__in=barcode_id_list)

            if subcategory_id:
                book_ids_subcategorywise = LibraryBook.objects.filter(book_sub_category=subcategory_id,
                                                                      is_active=True).values_list('id', flat=True)

                # Use book_ids to filter the LibraryBooksBarcode table
                barcode_ids = LibraryBooksBarcode.objects.filter(
                    book__in=book_ids_subcategorywise,
                    is_active=True  # Optionally ensure the barcode records are active
                ).values_list('id', flat=True)

                # Convert barcode_ids QuerySet to a list (optional)
                barcode_id_list = list(barcode_ids)

                filterdata = filterdata.filter(book_detail_id__in=barcode_id_list)

            if issue_date:
                filterdata = filterdata.filter(issue_date=issue_date)

            if return_date:
                filterdata = filterdata.filter(return_date=return_date)

            if book_barcode_no:
                # Use book_barcode_no to filter the LibraryBooksBarcode table
                barcode_ids = LibraryBooksBarcode.objects.filter(
                    barcode=book_barcode_no,
                    is_active=True  # Optionally ensure the barcode records are active
                ).values_list('id', flat=True)

                filterdata = filterdata.filter(book_detail_id__in=barcode_ids)

            if flag == "I" or flag == "i":
                filterdata = filterdata.filter(return_date__isnull=True)

            responseData = []
            penality_amount = None

            if filterdata.exists():

                # Library Penality Attach on response
                try:
                    LibraryPenalityInstance = ParameterValue.objects.get(parameter_name="LIBRARY_PENALITY_PER_DAY",
                                                                         is_active=True)
                except ObjectDoesNotExist:
                    return Response({
                        'message': 'We Can Not Found LIBRARY_PENALITY_PER_DAY in DB Please configuration that Part'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                # Convert org_value to integer (ensure it's a valid number)
                penality_amount = int(
                    LibraryPenalityInstance.org_value) if LibraryPenalityInstance.org_value else 0

                # set due date as per configuration Table data

                # Fetch how many days allowed for  keep book
                try:
                    KeepBookKeepInstance = ParameterValue.objects.get(
                        parameter_name="LIBRARY_BOOK_RETURN_DAYS", is_active=True)
                except ObjectDoesNotExist:
                    return Response({
                        'message': 'We Can Not Found LIBRARY_BOOK_RETURN_DAYS in DB Please configuration that Part'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                # Convert org_value to integer (ensure it's a valid number)
                days_allowed = int(
                    KeepBookKeepInstance.org_value) if KeepBookKeepInstance.org_value else 0
                # print(filterdata)
                for item in filterdata:

                    # Calculate Due Date
                    due_date = None
                    if item.issue_date and days_allowed > 0:
                        due_date = item.issue_date + timedelta(days=days_allowed)

                    if item.student != None and item.professor == None:

                        try:
                            studentCourseInstance = StudentCourse.objects.get(student=item.student, is_active=True)
                        except ObjectDoesNotExist:
                            continue

                        # name_part = filter(None, [
                        #     studentclassInstance.student_id.first_name,
                        #     studentclassInstance.student_id.middle_name,
                        #     studentclassInstance.student_id.last_name
                        #
                        # ])
                        # student_name = " ".join(name_part)

                        name_parts = [
                            studentCourseInstance.student.first_name.strip() if studentCourseInstance.student.first_name else "",
                            studentCourseInstance.student.middle_name.strip() if studentCourseInstance.student.middle_name else "",
                            studentCourseInstance.student.last_name.strip() if studentCourseInstance.student.last_name else "",
                        ]

                        # Join the names ensuring a single space between them
                        student_name = " ".join(name_parts).strip()

                        # Get Issued staff
                        staff_name = ""
                        if item.issued_by:
                            try:
                                EmployeeInstance = EmployeeMaster.objects.get(id=item.issued_by, is_active=True)
                            except:
                                return Response({"message": "you are not a authenticate user for book issue"},
                                                status=status.HTTP_400_BAD_REQUEST)

                            name_parts = [
                                EmployeeInstance.title.strip() if EmployeeInstance.title else "",
                                EmployeeInstance.first_name.strip() if EmployeeInstance.first_name else "",
                                EmployeeInstance.middle_name.strip() if EmployeeInstance.middle_name else "",
                                EmployeeInstance.last_name.strip() if EmployeeInstance.last_name else "",
                            ]

                            # Join the non-empty parts with a single space
                            staff_name = " ".join(part for part in name_parts if part).strip()
                        staff_returned = ""
                        if item.returned_by:
                            try:
                                EmployeeInstance = EmployeeMaster.objects.get(id=item.issued_by, is_active=True)
                            except:
                                return Response({"message": "you are not a authenticate user for book issue"},
                                                status=status.HTTP_400_BAD_REQUEST)

                            name_parts = [
                                EmployeeInstance.title,
                                EmployeeInstance.first_name,
                                EmployeeInstance.middle_name,
                                EmployeeInstance.last_name
                            ]

                            # Filter out None or empty strings and join them with a space
                            staff_returned = " ".join(filter(bool, name_parts)).strip()

                        data = {
                            'book_issue_id': item.book_issue_id,
                            'student_id': item.student_id if item.student else None,
                            'professor_id': item.professor_id if item.professor else None,
                            'name': student_name,
                            'college_admission_no': studentCourseInstance.student.college_admission_no,
                            'student_barcode': studentCourseInstance.student.barcode,
                            'course_name': studentCourseInstance.course.course_name,
                            'section_name': studentCourseInstance.section.section_name,
                            'bookName': item.book_detail.book.book_name,
                            'barcode': item.book_detail.barcode,
                            'book_barcode_id': item.book_detail.id,
                            'issue_date': item.issue_date,
                            'due_date': due_date,
                            'return_date': item.return_date,
                            'issued_by': staff_name,
                            'returned_by': staff_returned

                        }

                        responseData.append(data)
                        continue

                    if item.professor != None and item.student == None:

                        try:
                            EmployeeInstance = EmployeeMaster.objects.get(id=item.professor.id, is_active=True)
                        except ObjectDoesNotExist:
                            continue

                        name_part = filter(None, [
                            EmployeeInstance.title,
                            EmployeeInstance.first_name,
                            EmployeeInstance.middle_name,
                            EmployeeInstance.last_name

                        ])
                        staff_name = " ".join(name_part)

                        # Get Issued staff
                        Issued_staff_name = ""
                        if item.issued_by:
                            try:
                                EmployeeInstance = EmployeeMaster.objects.get(id=item.issued_by, is_active=True)
                            except:
                                return Response({"message": "you are not a authenticate user for book issue"},
                                                status=status.HTTP_400_BAD_REQUEST)

                            name_part = filter(None, [
                                EmployeeInstance.title,
                                EmployeeInstance.first_name,
                                EmployeeInstance.middle_name,
                                EmployeeInstance.last_name

                            ])
                            Issued_staff_name = " ".join(name_part)
                        staff_returned = ""
                        if item.returned_by:
                            try:
                                EmployeeInstance = EmployeeMaster.objects.get(id=item.issued_by, is_active=True)
                            except:
                                return Response({"message": "you are not a authenticate user for book issue"},
                                                status=status.HTTP_400_BAD_REQUEST)

                            name_part = filter(None, [
                                EmployeeInstance.title,
                                EmployeeInstance.first_name,
                                EmployeeInstance.middle_name,
                                EmployeeInstance.last_name

                            ])
                            staff_returned = " ".join(name_part)

                        data = {
                            'book_issue_id': item.book_issue_id,
                            # 'student_id': item.student.id,
                            'professor_id': item.professor.id,
                            'professor_name': staff_name,
                            # 'college_admission_no': None,
                            # 'student_barcode': None,
                            # 'className': None,
                            # 'sectionName': None,
                            'book_name': item.book_detail.book.book_name,
                            'barcode': item.book_detail.barcode,
                            'book_barcode_id': item.book_detail.id,
                            'issue_date': item.issue_date,
                            'due_date': due_date,
                            'return_date': item.return_date,
                            'issued_by': Issued_staff_name,
                            'returned_by': staff_returned

                        }

                        responseData.append(data)
                        continue
                    else:
                        continue

                return Response({'message': 'success', 'Penality_amount': penality_amount, 'data': responseData},
                                status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)



        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='LibraryBookIssuessearchlist',

            message=error_message,

        )


class BookRetrunedUpdateAPIView(UpdateAPIView):
    serializer_class = BookIssuedUpdateSerializer

    def update(self, request, *args, **kwargs):
        try:
            ReturnBookDetails = request.data.get("ReturnBooks")
            academicyearId = request.data.get("academic_year_id")
            orgId = request.data.get("organization_id")
            batch_id = request.data.get("branch_id")

            if not ReturnBookDetails:
                return Response({"message": "Please provide book details for return"},
                                status=status.HTTP_400_BAD_REQUEST)

            for item in ReturnBookDetails:
                return_date = item.get("return_date")

                # Check if return_date is missing or None
                if return_date is None:
                    return Response({'message': 'Return Date is required.'}, status=status.HTTP_400_BAD_REQUEST)

                # Check if return_date is a valid date format (YYYY-MM-DD)
                try:
                    datetime.strptime(return_date, "%Y-%m-%d")  # Change format if needed
                except ValueError:
                    return Response({'message': 'Invalid Return Date format. Expected YYYY-MM-DD.'},
                                    status=status.HTTP_400_BAD_REQUEST)
                try:
                    bookIssuesInstance = LibraryBooksIssues.objects.get(
                        book_issue_id=item.get("bookIssuedId"),
                        is_active=True
                    )
                except ObjectDoesNotExist:
                    return Response({"message": "Book details not found"}, status=status.HTTP_400_BAD_REQUEST)

                studentId = item.get("studentId")
                teacherId = item.get("tracherId")

                # Check if book was issued to a student
                if studentId is not None and teacherId is None:
                    penalty_amount = item.get("penalty_amount")

                    # Check if penalty applies
                    if penalty_amount and float(penalty_amount) > 0:

                        # Fetch related records
                        try:
                            registrationInstance = StudentRegistration.objects.get(id=studentId, is_active=True)
                            
                            # Get StudentCourse - using filter().first() to be safer than get() in case of history
                            studentCourseInstance = StudentCourse.objects.filter(student=registrationInstance, is_active=True).first()
                            
                            if not studentCourseInstance:
                                return Response({"message": "Active Student Course record not found"}, status=status.HTTP_400_BAD_REQUEST)

                            # Use Student's Context for the Fee Record
                            academicInstance = studentCourseInstance.academic_year
                            OrganizationInstance = studentCourseInstance.organization # Use from StudentCourse directly
                            BranchInstance = studentCourseInstance.branch         # Use from StudentCourse directly

                        except ObjectDoesNotExist as e:
                            return Response({"message": f"Record not found: {str(e)}"},
                                            status=status.HTTP_400_BAD_REQUEST)

                        # Insert Penalty Record
                        try:
                            penaltyFeesInstance = StudentFeeDetail.objects.create(
                                student=registrationInstance,
                                student_course=studentCourseInstance,
                                fee_group=None,
                                fee_structure_details=None,
                                element_name="LIBRARY_BOOK_PENALTY",
                                fee_applied_from=studentCourseInstance.semester,
                                semester=studentCourseInstance.semester,
                                paid="N",
                                academic_year=academicInstance,
                                organization=OrganizationInstance,
                                branch=BranchInstance,
                                department=studentCourseInstance.department,
                                multiplying_factor=1,
                                element_amount=penalty_amount,
                                total_element_period_amount=penalty_amount,
                                paid_amount=0.00,
                                remarks="Library book late return penalty",
                                reverse_flag="",
                                created_by=item.get("returned_by"),
                                updated_by=item.get("returned_by"),
                            )

                        except Exception as e:
                            return Response({"error": f"Failed to create penalty record: {str(e)}"},
                                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    # Update book issue record
                    bookIssuesInstance.return_date = item.get("return_date")
                    bookIssuesInstance.returned_by = item.get("returned_by")
                    bookIssuesInstance.save()


                elif studentId is None and teacherId is not None:
                    bookIssuesInstance.return_date = item.get("return_date")
                    bookIssuesInstance.returned_by = item.get("returned_by")
                    bookIssuesInstance.save()


                else:

                    continue

            return Response({"message": "Success"}, status=status.HTTP_200_OK)

        except Http404:
            return Response({"message": "Record not found"}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            self.log_exception(request, str(e))
            return Response({"error": "A database error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            self.log_exception(request, str(e))
            return Response({"error": f"An unexpected error occurred: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        print(f"Logging error: {error_message}")  # Debugging
        ExceptionTrack.objects.create(
            request=str(request),
            process_name="LibraryBookReturned",
            message=error_message,
        )


# class BookRetrunedUpdateAPIView(UpdateAPIView):
#     serializer_class =BookIssuedUpdateSerializer
#
#     def update(self, request, *args, **kwargs):
#         try:
#
#             ReturnBookDetails = self.request.data.get('ReturnBooks')
#             academicyearId = self.request.data.get('academic_year_id')
#             orgId = self.request.data.get('organization_id')
#             batch_id = self.request.data.get('branch_id')
#
#
#
#             if ReturnBookDetails:
#                 # print(ReturnBookDetails)
#                 for item in ReturnBookDetails:
#                     # print(item.get("bookIssuedId"))
#                     # print(item.bookbarcodeId,type(item.bookbarcodeId))
#                     try:
#                         bookIssuesInstance = LibraryBooksIssues.objects.get(book_issue_id=item.get("bookIssuedId"),
#                                                                                 is_active=True)
#                     except:
#                         return Response({'message': 'Book details not found'}, status=status.HTTP_400_BAD_REQUEST)
#
#                     # print(bookIssuesInstance)
#
#                     print(item.get("studentId"),type(item.get("studentId")))
#
#                     # check book issued by who
#                     if item.get("studentId") != None and item.get("tracherId") == None:
#
#
#                         # Check penalty applied or not
#                         if item.get("penalty_amount") > 0:
#                             print("penanality")
#                             # Get Student Instance
#                             try:
#                                 registrationInstance= StudentRegistration.objects.get(id=item.get("studentId"),is_active=True)
#                             except ObjectDoesNotExist:
#                                 return Response({'message':'student Record Not found'},status=status.HTTP_400_BAD_REQUEST)
#
#                             print(registrationInstance)
#                             try:
#                                 academicInstance= Academic_Session_Year.objects.get(id=academicyearId,is_active=True)
#                             except ObjectDoesNotExist:
#                                 return Response({'message':'academic year Record Not found'},status=status.HTTP_400_BAD_REQUEST)
#
#                             try:
#                                 OrganizationInstance= Academic_Session_Year.objects.get(id=orgId,is_active=True)
#                             except ObjectDoesNotExist:
#                                 return Response({'message':'academic year Record Not found'},status=status.HTTP_400_BAD_REQUEST)
#
#                             try:
#                                 BranchInstance = Batch.objects.get(id=batch_id,is_active=True)
#                             except ObjectDoesNotExist:
#                                 return Response({'message': 'Branch Record Not found'},
#                                                 status=status.HTTP_400_BAD_REQUEST)
#
#                             # Get Which fee period continue
#
#                             current_date = date.today()
#                             print(current_date)
#                             # Query to find the period where current_date falls within the range
#                             try:
#                                 matching_periods = Periods.objects.get(period_start_date__lte=current_date,
#                                                                       period_end_date__gte=current_date)
#                             except ObjectDoesNotExist:
#                                 return Response({'message':'No Fee Period Found'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#                             print(matching_periods.id)
#
#                             # Insert Penalty record on
#                             penaltyFeesInstance= Student_Fee_Details.objects.create(
#                                 student_id=registrationInstance,
#                                 fee_structure_id = None,
#                                 fee_structure_details_id = None,
#                                 element_name = 'LIBRARY_BOOK_PENALTY',
#                                 feeappfrom =matching_periods.id,
#                                 paid = 'N',
#                                 academic_year_id= academicInstance,
#                                 organization_id = OrganizationInstance,
#                                 branch_id =BranchInstance,
#                                 multiplying_factor= 1,
#                                 element_amount = item.get("penalty_amount"),
#                                 total_element_period_amount = item.get("penalty_amount"),
#                                 paid_amount = 0.00,
#                                 remarks ="",
#                                 reverse_flag="",
#                                 created_by=item.get("returned_by"),
#                                 updated_by=item.get("returned_by")
#
#                             )
#                             print(penaltyFeesInstance)
#
#                         # update the record
#
#                         bookIssuesInstance.return_date = item.get("return_date")
#                         bookIssuesInstance.returned_by= item.get("returned_by")
#                         bookIssuesInstance.save()
#
#                         continue
#
#
#                     elif item.get("studentId") == None and item.get("tracherId") != None:
#                         bookIssuesInstance.return_date = item.get("return_date")
#                         bookIssuesInstance.returned_by = item.get("returned_by")
#                         bookIssuesInstance.save()
#
#                     else:
#                         print("not enter into record")
#                         continue
#
#                 return Response({'message':'success'},status=status.HTTP_200_OK)
#
#
#             else:
#                 return Response({'message': 'Please provide book details for  return'}, status=status.HTTP_200_OK)
#
#
#         except Http404:
#
#             return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)
#
#
#
#         except ValidationError as e:
#
#             return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
#
#
#
#         except DatabaseError as e:
#
#             self.log_exception(request, str(e))
#
#             return Response({'error': 'A database error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#
#
#         except Exception as e:
#
#             self.log_exception(request, str(e))
#
#             return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#     def log_exception(self, request, error_message):
#
#         ExceptionTrack.objects.create(
#
#             request=str(request),
#
#             process_name='LibraryBookReturned',
#
#             message=error_message,
#
#         )
#
#
#         # else:
#             #     return Response({'message':'Please Provide return Book List '},status=status.HTTP_400_BAD_REQUEST)
#
#             # bookbarcodeId = request.data.get('bookbarcodeId')
#             #
#             # return_date = request.data.get('return_date')
#             #
#             # returned_by = request.data.get('returned_by')
#
#             # print(bookbarcodeId,return_date,returned_by)
#
#             # try:
#             #     bookIssuesInstance = LibraryBooksIssues.objects.get(book_detail_id=bookbarcodeId,is_active=True)
#             # except:
#             #     return Response({'message':'Book details not found'},status=status.HTTP_400_BAD_REQUEST)
#
#             #update the record
#
#             # bookIssuesInstance.return_date = return_date
#             # bookIssuesInstance.returned_by = returned_by
#
#             # bookIssuesInstance.save()
#
#             # return Response({'message':'return success'},status=status.HTTP_200_OK)

class AllBookBarcodeFilterListAPIView(ListAPIView):
    serializer_class = BookDetailsListSerializer

    def list(self, request, *args, **kwargs):
        try:
            bookcode = request.query_params.get('barcodeNo')
            barcode = request.query_params.get('barcodeId')
            bookname = request.query_params.get('bookname')
            category = request.query_params.get('book_category')
            sub_category = request.query_params.get('book_sub_category')
            # barcodeNo = self.request.query_params.get('barcodeNo')

            try:
                filterdata = LibraryBooksBarcode.objects.filter(is_active=True)
            except:
                filterdata = None

            if filterdata:
                if bookcode:
                    filterdata = filterdata.filter(book__book_code=bookcode, is_active=True)

                if barcode:
                    filterdata = filterdata.filter(barcode=barcode, is_active=True)

                if category:
                    filterdata = filterdata.filter(book__book_category__id=category, is_active=True)

                if sub_category:
                    filterdata = filterdata.filter(book__book_sub_category__id=sub_category, is_active=True)

                if bookname:
                    filterdata = (filterdata.filter(book__book_name=bookname, is_active=True))
                    # LibraryBook.objects.filter(book_name=bookname, is_active = True)

                # if

                if filterdata:
                    responsedata = []
                    for item in filterdata:
                        # Calculate total copies for this book (all active barcodes)
                        total_copies = LibraryBooksBarcode.objects.filter(
                            book=item.book,
                            is_active=True
                        ).count()
                        
                        # Calculate issued copies (books that are issued and not returned)
                        issued_copies = LibraryBooksIssues.objects.filter(
                            book_detail__book=item.book,
                            return_date__isnull=True,
                            is_active=True
                        ).count()
                        
                        # Calculate available copies
                        available_copies = total_copies - issued_copies
                        
                        # Check if this specific barcode is currently issued
                        is_this_barcode_issued = LibraryBooksIssues.objects.filter(
                            book_detail=item,
                            return_date__isnull=True,
                            is_active=True
                        ).exists()
                        
                        # Determine if this barcode is available (status is active and not currently issued)
                        valid_statuses = ['Available', 'ACTIVE', 'Active', 'available']
                        is_available = (item.book_barcode_status in valid_statuses) and not is_this_barcode_issued
                        
                        data = {
                            'id': item.id,
                            'barcode': item.barcode,
                            'bookName': item.book.book_name,
                            'bookCode': item.book.book_code,
                            'categoryId': item.book.book_category.id,
                            'categoryName': item.book.book_category.category_name,
                            'subcategoryId': item.book.book_sub_category.id,
                            'subcategoryName': item.book.book_sub_category.sub_category_name,
                            'bookBarcodeStatus': item.book_barcode_status,
                            'totalCopies': total_copies,
                            'availableCopies': available_copies,
                            'isAvailable': is_available,
                        }

                        responsedata.append(data)

                    return Response({'message': 'success', 'data': responsedata}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)


        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='LibraryBooklist',

            message=error_message,

        )


class BookTitleReportListAPIView(ListAPIView):
    serializer_class = BookTitleReportSerializer

    def list(self, request, *args, **kwargs):
        try:
            academicyearId = request.query_params.get('academic_year_id')
            orgId = request.query_params.get('org_id')
            batch_id = request.query_params.get('branch_id')
            librarybatch_id = request.query_params.get('library_branch_id')
            categoryId = request.query_params.get('categoryId')
            subcategoryId = request.query_params.get('subcategoryId')
            book_name = request.query_params.get('book_name')
            book_author = request.query_params.get('book_author')

            if not academicyearId:
                return Response({'message': 'please provide valid academic year ID'})

            if not orgId:
                return Response({'message': 'please provide valid organization ID'})

            if not batch_id:
                return Response({'message': 'please provide valid branch ID'})

            filterdata = LibraryBook.objects.filter(academic_year_id=academicyearId, organization_id=orgId,
                                                    batch_id=batch_id, is_active=True)

            if filterdata:
                if categoryId:
                    filterdata = filterdata.filter(book_category=categoryId)

                if subcategoryId:
                    filterdata = filterdata.filter(book_sub_category=subcategoryId)

                if librarybatch_id:
                    filterdata = filterdata.filter(library_branch_id=librarybatch_id)

                if book_name:
                    filterdata = filterdata.filter(book_name__icontains=book_name)

                if book_author:
                    filterdata = filterdata.filter(author__icontains=book_author)

                finalResponseData = []
                if filterdata:
                    for item in filterdata:
                        Book_barcode_list = []
                        no_of_book_copies = 0

                        try:
                            bookdetails = LibraryBooksBarcode.objects.filter(book=item.id, is_active=True)
                        except:
                            bookdetails = None

                        if bookdetails.exists():  # Check if records exist
                            no_of_book_copies = bookdetails.count()  # Count records

                            Book_barcode_list = list(bookdetails.values_list('barcode', flat=True))

                        data = {
                            'id': item.id,
                            'book_name': item.book_name,
                            'author_name': item.author,
                            'categoryName': item.book_category.category_name,
                            'subcategory_name': item.book_sub_category.sub_category_name,
                            'barcodeList': Book_barcode_list,
                            'no_of_book_copies': no_of_book_copies
                        }

                        finalResponseData.append(data)

                    return Response({'message': 'success', 'data': finalResponseData}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)


            else:
                return Response({'message': 'No record Found'}, status=status.HTTP_200_OK)




        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='LibraryBookTitleReport',

            message=error_message,

        )


class LibraryBookJournalReportList(ListAPIView):
    serializer_class = LibraryBookSerializer

    def list(self, request, *args, **kwargs):
        try:

            academicyearId = self.kwargs.get('academic_year_id')

            try:
                JournalReportList = LibraryBook.objects.filter(academic_year_id=academicyearId,
                                                               type__icontains='JOURNAL', is_active=True)
            except:
                JournalReportList = None

            finalResponseData = []

            if JournalReportList.exists():
                for item in JournalReportList:

                    no_of_book_copies = 0

                    try:
                        bookdetails = LibraryBooksBarcode.objects.filter(book=item.id, is_active=True)
                    except:
                        bookdetails = None

                    if bookdetails.exists():  # Check if records exist
                        no_of_book_copies = bookdetails.count()  # Count records

                    data = {
                        'id': item.id,
                        'BookName': item.book_name,
                        'ISBN': item.ISBN,
                        'publisher': item.publisher,
                        'volume': item.volume,
                        'IssueNo': item.IssueNo,
                        'Period': item.Period,
                        'no_of_copies': no_of_book_copies,
                        'book_status': item.book_status
                    }

                    finalResponseData.append(data)

                return Response({'message': 'success', 'data': finalResponseData}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='LibraryBookJournalReportList',

            message=error_message,

        )


class LibraryIssueReturnReportListAPIView(ListAPIView):
    serializer_class = IssueReturnReportSerializer

    def list(self, request, *args, **kwargs):
        try:
            academicyearId = request.query_params.get('academic_year_id')
            fromDate = request.query_params.get('fromDate')
            toDate = request.query_params.get('toDate')
            registrationNo = request.query_params.get('registrationNo')
            flag = request.query_params.get('flag')

            # Start with base queryset
            filterdata = LibraryBooksIssues.objects.filter(is_active=True)

            # Filter by academic year if provided
            if academicyearId:
                filterdata = filterdata.filter(academic_year_id=academicyearId)

            # Filter by flag (I=Issued, R=Returned, A=All)
            if flag == "I" or flag == "i":
                filterdata = filterdata.filter(issue_date__isnull=False, return_date__isnull=True)
            elif flag == "R" or flag == "r":
                filterdata = filterdata.filter(issue_date__isnull=False, return_date__isnull=False)
            # If flag is "A" or not provided, show all (no additional filtering)

            # Filter by date range
            if fromDate:
                fromDate = datetime.strptime(fromDate, "%Y-%m-%d").date()
                filterdata = filterdata.filter(issue_date__gte=fromDate)

            if toDate:
                toDate = datetime.strptime(toDate, "%Y-%m-%d").date()
                filterdata = filterdata.filter(issue_date__lte=toDate)

            if registrationNo:
                try:
                    RegistrationInstance = StudentRegistration.objects.get(registration_no=registrationNo,
                                                                           is_active=True)
                except ObjectDoesNotExist:
                    RegistrationInstance = None

                if RegistrationInstance:
                    filterdata = filterdata.filter(student_id=RegistrationInstance.id)
                else:
                    return Response({'message': 'No record found'}, status=status.HTTP_200_OK)

            FinalResponseData = []
            if filterdata.exists():
                for item in filterdata:
                    # Student Instance - handle both student and professor cases
                    RegistrationInstance = None
                    if item.student:
                        try:
                            RegistrationInstance = StudentRegistration.objects.get(id=item.student.id)
                        except (ObjectDoesNotExist, AttributeError):
                            RegistrationInstance = None

                    # Student Name construct
                    student_name = ""
                    admission_no = None
                    school_barcode = None

                    if RegistrationInstance:
                        name_part = filter(None, [
                            RegistrationInstance.first_name,
                            RegistrationInstance.middle_name,
                            RegistrationInstance.last_name
                        ])
                        student_name = " ".join(name_part)
                        admission_no = RegistrationInstance.admission_no
                        school_barcode = RegistrationInstance.barcode

                        issueByName = ""
                        ReturnedByName = ""
                        # Issued By construct
                        if item.issued_by:
                            try:
                                EmployeeInstance = EmployeeMaster.objects.get(id=item.issued_by)
                            except ObjectDoesNotExist:
                                EmployeeInstance = None

                            if EmployeeInstance:
                                name_part = filter(None, [
                                    EmployeeInstance.title,
                                    EmployeeInstance.first_name,
                                    EmployeeInstance.middle_name,
                                    EmployeeInstance.last_name
                                ])
                                issueByName = " ".join(name_part)

                        if item.returned_by:
                            try:
                                EmployeeInstance = EmployeeMaster.objects.get(id=item.returned_by)
                            except ObjectDoesNotExist:
                                EmployeeInstance = None

                            if EmployeeInstance:
                                name_part = filter(None, [
                                    EmployeeInstance.title,
                                    EmployeeInstance.first_name,
                                    EmployeeInstance.middle_name,
                                    EmployeeInstance.last_name
                                ])
                                ReturnedByName = " ".join(name_part)

                        BookDetailsInstance = LibraryBook.objects.get(id=item.book_detail.book.id)

                        data = {
                            'studentName': student_name,
                            'admissionNo': admission_no,
                            'schoolBarcode': school_barcode,
                            'bookName': BookDetailsInstance.book_name,
                            'authorName': BookDetailsInstance.author,
                            'barcode': item.book_detail.barcode,
                            'issueDate': item.issue_date,
                            'returnDate': item.return_date,
                            'IssuesBy': issueByName,
                            'ReturnedBy': ReturnedByName
                        }

                        FinalResponseData.append(data)

                return Response({'message': 'success', 'data': FinalResponseData})
            else:
                return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)


        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(

            request=str(request),

            process_name='IssueReturnSerachList',

            message=error_message,

        )


class MostCirculatedBookListAPIView(ListAPIView):
    serializer_class = LibraryBookSerializer

    def list(self, request, *args, **kwargs):
        try:
            academicyearId = self.kwargs.get('academic_year_id')

            # Count issues per book using Django ORM
            issued_books = (
                LibraryBooksIssues.objects
                .filter(academic_year_id=academicyearId, is_active=True)
                .values('book_detail__book')  # Get book ID from barcode table through foreign key
                .annotate(issue_count=Count('book_issue_id'))  # Count issues
                .order_by('-issue_count')  # Order by highest issued
            )

            # Make response data
            finalResponseData = []
            for item in issued_books:
                book_id = item['book_detail__book']
                try:
                    bookInstance = LibraryBook.objects.get(id=book_id)
                    data = {
                        'book_name': bookInstance.book_name,
                        'author': bookInstance.author,
                        'issue_count': item['issue_count']
                    }
                    finalResponseData.append(data)
                except LibraryBook.DoesNotExist:
                    # Skip if book doesn't exist (shouldn't happen, but handle gracefully)
                    continue

            return Response({'message': 'success', 'data': finalResponseData}, status=status.HTTP_200_OK)


        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(

            request=str(request),

            process_name='MostCirculatedBooklist',

            message=error_message,

        )


class GetLostDamageBookListAPIView(ListAPIView):
    serializer_class = CheckBookLostDamagedSerializer

    def list(self, request, *args, **kwargs):
        try:
            flag = request.query_params.get('flag')

            filterdata = LibraryBooksBarcode.objects.none()

            if flag == 'B' or flag == 'b':

                try:
                    filterdata = LibraryBooksBarcode.objects.filter(
                        book_barcode_status__in=["damage", "Damage", "DAMAGE", "DAMAGED", "lost", "Lost", "LOST"],
                        is_active=True
                    )
                except Exception as e:
                    print(f"Error filtering both: {str(e)}")
                    filterdata = None

            elif flag == 'L' or flag == 'l':
                try:
                    filterdata = LibraryBooksBarcode.objects.filter(
                        book_barcode_status__in=["lost", "LOST", "Lost"],
                        is_active=True
                    )
                except Exception as e:
                    print(f"Error filtering lost: {str(e)}")
                    filterdata = None

            elif flag == 'D' or flag == 'd':

                try:
                    filterdata = LibraryBooksBarcode.objects.filter(
                        book_barcode_status__in=["damage", "DAMAGE", "Damage", "DAMAGED"],
                        is_active=True
                    )
                except Exception as e:
                    print(f"Error filtering damaged: {str(e)}")
                    filterdata = None

            if filterdata:
                finalresponseData = []
                for item in filterdata:
                    # Safely get related field values with null checks
                    try:
                        book_name = item.book.book_name if item.book else ''
                        book_code = item.book.book_code if item.book else ''
                        isbn_no = item.book.ISBN if item.book else ''
                        category = item.book.book_category.category_name if (
                                    item.book and item.book.book_category) else ''
                        sub_category = item.book.book_sub_category.sub_category_name if (
                                    item.book and item.book.book_sub_category) else ''
                        publisher = item.book.publisher if item.book else ''
                        author = item.book.author if item.book else ''
                        publish_year = item.book.publish_year if item.book else ''
                        library_branch = item.book.library_branch.library_branch_name if (
                                    item.book and item.book.library_branch) else ''

                        data = {
                            'id': item.id,
                            'book_name': book_name,
                            'book_code': book_code,
                            'barcode': item.barcode,
                            'isbnNo': isbn_no,
                            'category': category,
                            'subCategory': sub_category,
                            'publisher': publisher,
                            'author': author,
                            'publish_year': publish_year,
                            'library_branch': library_branch,
                            'book_status': item.book_barcode_status
                        }
                        finalresponseData.append(data)
                    except Exception as item_error:
                        # Log individual item errors but continue processing
                        print(f"Error processing item {item.id}: {str(item_error)}")
                        continue

                return Response({'message': 'success', 'data': finalresponseData}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No record found', 'data': []}, status=status.HTTP_200_OK)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(

            request=str(request),

            process_name='LostDamagedlist',

            message=error_message,

        )


class LibraryBookReportAPIView(ListAPIView):
    # queryset = LibraryBook.objects.all()
    serializer_class = LibraryBookReportSerializer

    def list(self, request, *args, **kwargs):
        try:
            academicyearId = request.query_params.get('academic_year_id')
            fromDate = request.query_params.get('fromDate')
            toDate = request.query_params.get('toDate')

            if not academicyearId:
                return Response({'message': 'academic year Id need'}, status=status.HTTP_400_BAD_REQUEST)

            filterdata = LibraryBook.objects.filter(academic_year_id=academicyearId, is_active=True)

            finalresponsedata = []
            if filterdata:

                # Apply date filtering
                if fromDate and toDate:
                    filterdata = filterdata.filter(created_at__date__range=[fromDate, toDate])
                elif fromDate:
                    filterdata = filterdata.filter(created_at__date__gte=fromDate)

                elif toDate:
                    filterdata = filterdata.filter(created_at__date__lte=toDate)

                if filterdata.exists():
                    for item in filterdata:
                        barcodedata = LibraryBooksBarcode.objects.filter(book=item.id, is_active=True)
                        for barcodes in barcodedata:
                            # Safely get library branch info
                            library_branch_id = None
                            library_branch_name = None
                            if item.library_branch_id:
                                try:
                                    library_branch_id = item.library_branch.library_branch_id
                                    library_branch_name = item.library_branch.library_branch_name
                                except (LibraryBranch.DoesNotExist, AttributeError):
                                    library_branch_id = None
                                    library_branch_name = None

                            # Safely get location info
                            location_id = None
                            location_name = None
                            if barcodes.location_id_id:
                                try:
                                    location_id = barcodes.location_id.id
                                    location_name = barcodes.location_id.book_location
                                except (BookLocation.DoesNotExist, AttributeError):
                                    location_id = None
                                    location_name = None

                            data = {
                                'id': item.id,
                                'book_code': item.book_code,
                                'book_name': item.book_name,
                                'book_categoryId': item.book_category.id if item.book_category else None,
                                'book_category': item.book_category.category_name if item.book_category else None,
                                'book_sub_categoryId': item.book_sub_category.id if item.book_sub_category else None,
                                'book_sub_category': item.book_sub_category.sub_category_name if item.book_sub_category else None,
                                'library_branch_id': library_branch_id,
                                'library_branch': library_branch_name,
                                'book_status': item.book_status,
                                'no_of_copies': item.no_of_copies,
                                'organization_id': item.organization.id if item.organization else None,
                                'organizationName': item.organization.organization_code if item.organization else None,
                                'batch_id': item.batch.id if item.batch else None,
                                'batchName': item.batch.batch_code if item.batch else None,
                                'publisher': item.publisher,
                                'author': item.author,
                                'publish_year': item.publish_year,
                                'volume': item.volume,
                                'front_cover': item.front_cover if item.front_cover else None,
                                'back_cover': item.back_cover if item.back_cover else None,
                                'edition': item.edition,
                                'pages': item.pages,
                                'bookBarcode': barcodes.barcode,
                                'bookBarcodeId': barcodes.id,
                                'locationId': location_id,
                                'locationName': location_name,
                                'barcode_auto_generated': item.barcode_auto_generated,
                                'ISBN': item.ISBN,
                                'academic_year_id': item.academic_year.id if item.academic_year else None,
                                'academic_year': item.academic_year.academic_year_code if item.academic_year else None,
                                'createdDate': item.createdDate,
                                'allow_issue': item.allow_issue,
                                'type': item.type,
                                'IssueNo': item.IssueNo,
                                'Period': item.Period,
                                'created_at': item.created_at
                            }

                            finalresponsedata.append(data)

                    return Response({'message': 'success', 'data': finalresponsedata}, status=status.HTTP_200_OK)

                else:
                    return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)



        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='LibraryBookReport',

            message=error_message,

        )


class LibraryBarcodeValidationAPIView(ListAPIView):
    serializer_class = LibraryBookBarcodeValidationSerializer

    def list(self, request, *args, **kwargs):
        try:
            barcodeList = request.query_params.get('barcodeList')

            # Convert barcodeList from string to actual list
            if barcodeList:
                barcodeList = json.loads(barcodeList)

            # Ensure barcodeList is a list before proceeding
            if not isinstance(barcodeList, list):
                return Response({'message': 'Invalid barcode list format'}, status=status.HTTP_400_BAD_REQUEST)

            exist_barcode_list = []
            for item in barcodeList:

                # check barcode already exist or not
                try:
                    barcodeExist = LibraryBooksBarcode.objects.get(barcode=item, is_active=True)
                except:
                    continue
                if barcodeExist:
                    exist_barcode_list.append(item)
                else:
                    pass

            if exist_barcode_list:
                return Response({'message': f'This barcode {exist_barcode_list} already exist'},
                                status=status.HTTP_400_BAD_REQUEST)

            else:
                return Response({'message': 'success'}, status=status.HTTP_200_OK)


        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            process_name='LibraryBarcodeValidation',

            message=error_message,

        )


class LibraryParameterConfigurationListAPIView(ListAPIView):
    serializer_class = LibraryBookConfigurationSerializer

    def list(self, request, *args, **kwargs):
        try:
            orgId = self.request.query_params.get('org_id')
            batch_id = self.request.query_params.get('branch_id')

            # Get or create parameter instances with default values
            ENABLE_LIBRARY_PENALITY_Instance, _ = ParameterValue.objects.get_or_create(
                parameter_name="ENABLE_LIBRARY_PENALITY",
                organization_id=orgId,
                batch_id=batch_id,
                defaults={'is_active': True, 'org_value': 'NO'})

            LIBRARY_BOOK_RETURN_DAYS_Instance, _ = ParameterValue.objects.get_or_create(
                parameter_name="LIBRARY_BOOK_RETURN_DAYS",
                organization_id=orgId,
                batch_id=batch_id,
                defaults={'is_active': True, 'org_value': '7'})

            LIBRARY_BOOK_RETURN_MESSAGE_DAYS_PRIOR_Instance, _ = ParameterValue.objects.get_or_create(
                parameter_name="LIBRARY_BOOK_RETURN_MESSAGE_DAYS_PRIOR",
                organization_id=orgId,
                batch_id=batch_id,
                defaults={'is_active': True, 'org_value': '3'})

            LIBRARY_BOOK_RETURN_MESSAGE_SEND_Instance, _ = ParameterValue.objects.get_or_create(
                parameter_name="LIBRARY_BOOK_RETURN_MESSAGE_SEND",
                organization_id=orgId,
                batch_id=batch_id,
                defaults={'is_active': True, 'org_value': 'NO'})

            LIBRARY_PENALITY_PER_DAY_Instance, _ = ParameterValue.objects.get_or_create(
                parameter_name="LIBRARY_PENALITY_PER_DAY",
                organization_id=orgId,
                batch_id=batch_id,
                defaults={'is_active': True, 'org_value': '0'})

            MAX_BOOKS_ISSUED_STUDENT_Instance, _ = ParameterValue.objects.get_or_create(
                parameter_name="MAX_BOOKS_ISSUED_STUDENT",
                organization_id=orgId,
                batch_id=batch_id,
                defaults={'is_active': True, 'org_value': '5'})

            MAX_BOOKS_ISSUED_TEACHER_Instance, _ = ParameterValue.objects.get_or_create(
                parameter_name="MAX_BOOKS_ISSUED_TEACHER",
                organization_id=orgId,
                batch_id=batch_id,
                defaults={'is_active': True, 'org_value': '10'})

            responseData = {
                'ENABLE_LIBRARY_PENALITY': ENABLE_LIBRARY_PENALITY_Instance.org_value,
                'LIBRARY_BOOK_RETURN_DAYS': LIBRARY_BOOK_RETURN_DAYS_Instance.org_value,
                'LIBRARY_BOOK_RETURN_MESSAGE_DAYS_PRIOR': LIBRARY_BOOK_RETURN_MESSAGE_DAYS_PRIOR_Instance.org_value,
                'LIBRARY_BOOK_RETURN_MESSAGE_SEND': LIBRARY_BOOK_RETURN_MESSAGE_SEND_Instance.org_value,
                'LIBRARY_PENALITY_PER_DAY': LIBRARY_PENALITY_PER_DAY_Instance.org_value,
                'MAX_BOOKS_ISSUED_STUDENT': MAX_BOOKS_ISSUED_STUDENT_Instance.org_value,
                'MAX_BOOKS_ISSUED_TEACHER': MAX_BOOKS_ISSUED_TEACHER_Instance.org_value

            }

            return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(

            request=str(request)[:100],

            process_name='LibraryParameterConfigurationList',

            message=str(error_message)[:200],
            data='',
        )


class LibraryConfigurationUpdateAPIView(APIView):

    def put(self, request, *args, **kwargs):
        try:
            # GET data from request
            orgId = request.data.get('org_id')
            batch_id = request.data.get('branch_id')
            ENABLE_LIBRARY_PENALITY_data = request.data.get('ENABLE_LIBRARY_PENALITY')
            LIBRARY_BOOK_RETURN_DAYS_data = request.data.get('LIBRARY_BOOK_RETURN_DAYS')
            LIBRARY_BOOK_RETURN_MESSAGE_DAYS_PRIOR_data = request.data.get('LIBRARY_BOOK_RETURN_MESSAGE_DAYS_PRIOR')
            LIBRARY_BOOK_RETURN_MESSAGE_SEND_data = request.data.get('LIBRARY_BOOK_RETURN_MESSAGE_SEND')
            LIBRARY_PENALITY_PER_DAY_data = request.data.get('LIBRARY_PENALITY_PER_DAY')
            MAX_BOOKS_ISSUED_STUDENT_data = request.data.get('MAX_BOOKS_ISSUED_STUDENT')
            MAX_BOOKS_ISSUED_TEACHER_data = request.data.get('MAX_BOOKS_ISSUED_TEACHER')

            # GET All PARAMETER INSTANCE

            # Get or create parameter instances
            ENABLE_LIBRARY_PENALITY_Instance, _ = ParameterValue.objects.get_or_create(
                parameter_name="ENABLE_LIBRARY_PENALITY",
                organization_id=orgId,
                batch_id=batch_id,
                defaults={'is_active': True, 'org_value': ENABLE_LIBRARY_PENALITY_data})

            LIBRARY_BOOK_RETURN_DAYS_Instance, _ = ParameterValue.objects.get_or_create(
                parameter_name="LIBRARY_BOOK_RETURN_DAYS",
                organization_id=orgId,
                batch_id=batch_id,
                defaults={'is_active': True, 'org_value': LIBRARY_BOOK_RETURN_DAYS_data})

            LIBRARY_BOOK_RETURN_MESSAGE_DAYS_PRIOR_Instance, _ = ParameterValue.objects.get_or_create(
                parameter_name="LIBRARY_BOOK_RETURN_MESSAGE_DAYS_PRIOR",
                organization_id=orgId,
                batch_id=batch_id,
                defaults={'is_active': True, 'org_value': LIBRARY_BOOK_RETURN_MESSAGE_DAYS_PRIOR_data})

            LIBRARY_BOOK_RETURN_MESSAGE_SEND_Instance, _ = ParameterValue.objects.get_or_create(
                parameter_name="LIBRARY_BOOK_RETURN_MESSAGE_SEND",
                organization_id=orgId,
                batch_id=batch_id,
                defaults={'is_active': True, 'org_value': LIBRARY_BOOK_RETURN_MESSAGE_SEND_data})

            LIBRARY_PENALITY_PER_DAY_Instance, _ = ParameterValue.objects.get_or_create(
                parameter_name="LIBRARY_PENALITY_PER_DAY",
                organization_id=orgId,
                batch_id=batch_id,
                defaults={'is_active': True, 'org_value': LIBRARY_PENALITY_PER_DAY_data})

            MAX_BOOKS_ISSUED_STUDENT_Instance, _ = ParameterValue.objects.get_or_create(
                parameter_name="MAX_BOOKS_ISSUED_STUDENT",
                organization_id=orgId,
                batch_id=batch_id,
                defaults={'is_active': True, 'org_value': MAX_BOOKS_ISSUED_STUDENT_data})

            MAX_BOOKS_ISSUED_TEACHER_Instance, _ = ParameterValue.objects.get_or_create(
                parameter_name="MAX_BOOKS_ISSUED_TEACHER",
                organization_id=orgId,
                batch_id=batch_id,
                defaults={'is_active': True, 'org_value': MAX_BOOKS_ISSUED_TEACHER_data})

            # update the record
            ENABLE_LIBRARY_PENALITY_Instance.org_value = ENABLE_LIBRARY_PENALITY_data
            LIBRARY_BOOK_RETURN_DAYS_Instance.org_value = LIBRARY_BOOK_RETURN_DAYS_data
            LIBRARY_BOOK_RETURN_MESSAGE_DAYS_PRIOR_Instance.org_value = LIBRARY_BOOK_RETURN_MESSAGE_DAYS_PRIOR_data
            LIBRARY_BOOK_RETURN_MESSAGE_SEND_Instance.org_value = LIBRARY_BOOK_RETURN_MESSAGE_SEND_data
            LIBRARY_PENALITY_PER_DAY_Instance.org_value = LIBRARY_PENALITY_PER_DAY_data
            MAX_BOOKS_ISSUED_STUDENT_Instance.org_value = MAX_BOOKS_ISSUED_STUDENT_data
            MAX_BOOKS_ISSUED_TEACHER_Instance.org_value = MAX_BOOKS_ISSUED_TEACHER_data

            ENABLE_LIBRARY_PENALITY_Instance.save()
            LIBRARY_BOOK_RETURN_DAYS_Instance.save()
            LIBRARY_BOOK_RETURN_MESSAGE_DAYS_PRIOR_Instance.save()
            LIBRARY_BOOK_RETURN_MESSAGE_SEND_Instance.save()
            LIBRARY_PENALITY_PER_DAY_Instance.save()
            MAX_BOOKS_ISSUED_STUDENT_Instance.save()
            MAX_BOOKS_ISSUED_TEACHER_Instance.save()

            return Response({'message': 'success'}, status=status.HTTP_200_OK)


        except Http404:

            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)


        except ValidationError as e:

            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)


        except DatabaseError as e:

            self.log_exception(request, str(e))

            return Response({'error': 'A database error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        except Exception as e:

            self.log_exception(request, str(e))

            return Response({'error': f'An unexpected error occurred: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request)[:100],

            process_name='LibraryBookConfigurationUpdate',

            message=str(error_message)[:200],
            data='',
        )


# Library Statistics API
class LibraryStatisticsAPIView(ListAPIView):
    """
    API to get library statistics:
    - Total No of Members (Students + Staff for the specified academic year)
    - Total number of Books
    - Total no of Titles
    - Total number of Book Issues
    - Total number of Books Returned

    When academic_year_id is provided:
    - Students are filtered by their academic year enrollment
    - Staff are filtered by their assignments for that academic year
    """

    def list(self, request, *args, **kwargs):
        try:
            # Get query parameters for filtering
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            academic_year_id = request.query_params.get('academic_year_id')

            # Check if the academic_year_id is valid (exists in database)
            valid_academic_year = False
            if academic_year_id:
                valid_academic_year = AcademicYear.objects.filter(id=academic_year_id).exists()

            # 1. Total No of Members (Students + Staff who can access library)
            # For students, filter through StudentCourse to get students enrolled in specific academic year
            total_students = 0
            if valid_academic_year:
                # Get students enrolled in the specified academic year
                student_course_qs = StudentCourse.objects.filter(
                    is_active=True,
                    academic_year_id=academic_year_id
                )

                # Apply org and branch filters
                if organization_id:
                    student_course_qs = student_course_qs.filter(organization_id=organization_id)
                if branch_id:
                    student_course_qs = student_course_qs.filter(branch_id=branch_id)

                # Get unique student IDs from course enrollments
                student_ids = student_course_qs.values_list('student_id', flat=True).distinct()
                total_students = len(student_ids)

            # If no valid academic year or no students found, count all active students for org/branch
            if total_students == 0:
                students_qs = StudentRegistration.objects.filter(is_active=True)
                if organization_id:
                    students_qs = students_qs.filter(organization_id=organization_id)
                if branch_id:
                    students_qs = students_qs.filter(branch_id=branch_id)
                total_students = students_qs.count()

            # For staff, use employee assignments to filter by academic year if available
            # If no assignments exist, fall back to counting all active staff
            total_staff = 0
            if valid_academic_year:
                # Get staff who have assignments for the specified academic year
                staff_assignments_qs = EmployeeAssignment.objects.filter(
                    is_active=True,
                    academic_year_id=academic_year_id
                )

                # Apply org and branch filters to assignments
                if organization_id:
                    staff_assignments_qs = staff_assignments_qs.filter(organization_id=organization_id)
                if branch_id:
                    staff_assignments_qs = staff_assignments_qs.filter(branch_id=branch_id)

                # Get unique employee IDs from assignments
                staff_employee_ids = list(staff_assignments_qs.values_list('employee_master_id', flat=True).distinct())
                total_staff = len(staff_employee_ids)

            # If no valid academic year or no staff found, count all active staff for org/branch
            if total_staff == 0:
                staff_qs = EmployeeMaster.objects.filter(is_active=True)
                if organization_id:
                    staff_qs = staff_qs.filter(organization_id=organization_id)
                if branch_id:
                    staff_qs = staff_qs.filter(branch_id=branch_id)
                total_staff = staff_qs.count()

            total_members = total_students + total_staff

            # 2. Total number of Books (unique books in library)
            books_qs = LibraryBook.objects.filter(is_active=True)
            if organization_id:
                books_qs = books_qs.filter(organization_id=organization_id)
            if branch_id:
                books_qs = books_qs.filter(batch_id=branch_id)
            # Books are not filtered by academic year (they are permanent assets)

            total_books = books_qs.count()

            # 3. Total no of Titles (distinct book names/titles)
            total_titles = books_qs.values('book_name').distinct().count()

            # 4. Total number of Book Issues
            issues_qs = LibraryBooksIssues.objects.filter(is_active=True)
            
            # Only filter by academic year if it's valid and has data
            if valid_academic_year:
                filtered_issues = issues_qs.filter(academic_year_id=academic_year_id)
                # Only apply the filter if it returns results
                if filtered_issues.exists():
                    issues_qs = filtered_issues

            # Filter by organization and branch through book details
            if organization_id or branch_id:
                book_barcodes = LibraryBooksBarcode.objects.filter(is_active=True)
                if organization_id:
                    book_barcodes = book_barcodes.filter(organization_id=organization_id)
                if branch_id:
                    book_barcodes = book_barcodes.filter(batch_id=branch_id)
                barcode_ids = book_barcodes.values_list('id', flat=True)
                issues_qs = issues_qs.filter(book_detail_id__in=barcode_ids)

            total_book_issues = issues_qs.count()

            # 5. Total number of Books Returned
            total_books_returned = issues_qs.filter(return_date__isnull=False).count()

            # Additional useful statistics
            currently_issued = issues_qs.filter(return_date__isnull=True).count()

            # Prepare response data
            statistics_data = {
                'totalMembers': total_members,
                'totalMembersBreakdown': {
                    'students': total_students,
                    'staff': total_staff
                },
                'totalBooks': total_books,
                'totalTitles': total_titles,
                'totalBookIssues': total_book_issues,
                'totalBooksReturned': total_books_returned,
                'additionalStats': {
                    'currentlyIssued': currently_issued,
                    'returnRate': f"{round((total_books_returned / total_book_issues * 100), 2) if total_book_issues > 0 else 0}%"
                }
            }

            return Response({
                'message': 'Library statistics retrieved successfully',
                'data': statistics_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        try:
            ExceptionTrack.objects.create(
                request=str(request)[:100],
                process_name='LibraryStatistics',
                message=error_message[:200] if error_message else '',
            )
        except Exception:
            # If logging fails, don't break the error response
            pass


# Book Dashboard API
class BookDashboardAPIView(ListAPIView):
    """
    Comprehensive Book Dashboard API providing library statistics and insights
    """

    def list(self, request, *args, **kwargs):
        try:
            from datetime import datetime, timedelta
            from django.db.models import Count, Q, Sum

            # Get query parameters for filtering
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')

            # Base querysets
            books_qs = LibraryBook.objects.filter(is_active=True)
            barcodes_qs = LibraryBooksBarcode.objects.filter(is_active=True)
            issues_qs = LibraryBooksIssues.objects.filter(is_active=True)
            categories_qs = BookCategory.objects.filter(is_active=True)

            # Apply filters if provided
            if organization_id:
                books_qs = books_qs.filter(organization_id=organization_id)
                barcodes_qs = barcodes_qs.filter(organization_id=organization_id)
                categories_qs = categories_qs.filter(organization_id=organization_id)
            if branch_id:
                books_qs = books_qs.filter(branch_id=branch_id)
                barcodes_qs = barcodes_qs.filter(branch_id=branch_id)
                categories_qs = categories_qs.filter(branch_id=branch_id)

            # 1. BASIC STATISTICS
            total_books = books_qs.count()
            total_book_copies = barcodes_qs.count()
            total_categories = categories_qs.count()
            total_subcategories = BookSubCategory.objects.filter(is_active=True).count()
            total_locations = BookLocation.objects.filter(is_active=True).count()
            total_branches = LibraryBranch.objects.filter(is_active=True).count()

            # 2. BOOK STATUS BREAKDOWN
            available_books = barcodes_qs.filter(
                Q(book_barcode_status='AVAILABLE') |
                Q(book_barcode_status='Available') |
                Q(book_barcode_status='available')
            ).count()

            issued_books = barcodes_qs.filter(
                Q(book_barcode_status='ISSUED') |
                Q(book_barcode_status='Issued') |
                Q(book_barcode_status='issued')
            ).count()

            damaged_books = barcodes_qs.filter(
                Q(book_barcode_status='DAMAGED') |
                Q(book_barcode_status='Damaged') |
                Q(book_barcode_status='damaged')
            ).count()

            lost_books = barcodes_qs.filter(
                Q(book_barcode_status='LOST') |
                Q(book_barcode_status='Lost') |
                Q(book_barcode_status='lost')
            ).count()

            # 3. ISSUE/RETURN STATISTICS
            total_issues = issues_qs.count()
            currently_issued = issues_qs.filter(return_date__isnull=True).count()
            returned_books_count = issues_qs.filter(return_date__isnull=False).count()

            # 4. TIME-BASED STATISTICS (Last 30 days)
            thirty_days_ago = datetime.now().date() - timedelta(days=30)
            books_added_this_month = books_qs.filter(created_at__gte=thirty_days_ago).count()
            issues_this_month = issues_qs.filter(issue_date__gte=thirty_days_ago).count()
            returns_this_month = issues_qs.filter(return_date__gte=thirty_days_ago).count()

            # 5. OVERDUE BOOKS (Issues without return after 14 days)
            fourteen_days_ago = datetime.now().date() - timedelta(days=14)
            overdue_books = issues_qs.filter(
                return_date__isnull=True,
                issue_date__lt=fourteen_days_ago
            ).count()

            # 6. CATEGORY BREAKDOWN
            category_stats = []
            if total_categories > 0:
                for category in categories_qs:
                    category_books = books_qs.filter(book_category=category).count()
                    category_stats.append({
                        'categoryId': category.id,
                        'categoryName': category.category_name,
                        'booksCount': category_books
                    })

            # 7. RECENT ACTIVITIES (Last 10)
            recent_books = []
            if total_books > 0:
                recent_book_objects = books_qs.order_by('-created_at')[:5]
                for book in recent_book_objects:
                    recent_books.append({
                        'book': book.id,
                        'bookName': book.book_name,
                        'bookCode': book.book_code,
                        'category': book.book_category.category_name if book.book_category else 'N/A',
                        'addedDate': book.created_at.strftime('%Y-%m-%d') if book.created_at else 'N/A'
                    })

            recent_issues = []
            if total_issues > 0:
                recent_issue_objects = issues_qs.order_by('-issue_date')[:5]
                for issue in recent_issue_objects:
                    recent_issues.append({
                        'issueId': issue.book_issue_id,
                        'studentId': issue.student_id,
                        'professorId': issue.professor_id,
                        'bookBarcode': issue.book_detail.barcode if issue.book_detail else 'N/A',
                        'issueDate': issue.issue_date.strftime('%Y-%m-%d') if issue.issue_date else 'N/A',
                        'returnDate': issue.return_date.strftime('%Y-%m-%d') if issue.return_date else 'Not Returned',
                        'status': 'Returned' if issue.return_date else 'Issued'
                    })

            # 8. POPULAR BOOKS (Most issued)
            popular_books = []
            if total_issues > 0:
                popular_book_data = (issues_qs
                .values('book_detail_id__book__book_name', 'book_detail_id__book__book_code')
                .annotate(issue_count=Count('book_issue_id'))
                .order_by('-issue_count')[:5])

                for book_data in popular_book_data:
                    if book_data['book_detail_id__book__book_name']:
                        popular_books.append({
                            'bookName': book_data['book_detail_id__book__book_name'],
                            'bookCode': book_data['book_detail_id__book__book_code'],
                            'issueCount': book_data['issue_count']
                        })

            # Compile dashboard response
            dashboard_data = {
                'basicStats': {
                    'totalBooks': total_books,
                    'totalBookCopies': total_book_copies,
                    'totalCategories': total_categories,
                    'totalSubCategories': total_subcategories,
                    'totalLocations': total_locations,
                    'totalBatch': total_branches
                },
                'bookStatus': {
                    'available': available_books,
                    'issued': issued_books,
                    'damaged': damaged_books,
                    'lost': lost_books,
                    'utilizationRate': f"{round((issued_books / total_book_copies * 100), 2) if total_book_copies > 0 else 0}%"
                },
                'issueStats': {
                    'totalIssues': total_issues,
                    'currentlyIssued': currently_issued,
                    'returnedBooks': returned_books_count,
                    'overdueBooks': overdue_books
                },
                'monthlyStats': {
                    'booksAddedThisMonth': books_added_this_month,
                    'issuesThisMonth': issues_this_month,
                    'returnsThisMonth': returns_this_month
                },
                'categoryBreakdown': category_stats,
                'recentActivities': {
                    'recentBooks': recent_books,
                    'recentIssues': recent_issues
                },
                'popularBooks': popular_books,
                'systemHealth': {
                    'overdueRate': f"{round((overdue_books / currently_issued * 100), 2) if currently_issued > 0 else 0}%",
                    'returnRate': f"{round((returned_books_count / total_issues * 100), 2) if total_issues > 0 else 0}%",
                    'averageBooksPerCategory': f"{round((total_books / total_categories), 2) if total_categories > 0 else 0}"
                }
            }

            return Response({
                'message': 'Dashboard data retrieved successfully',
                'data': dashboard_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            error_message = str(e)
            self.log_exception(request, error_message)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request)[:100],
            process_name='BookDashboard',
            message=error_message[:200] if error_message else '',
        )