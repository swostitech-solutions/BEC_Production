import base64
import json
import os
import uuid
import re
import unicodedata
from datetime import date
from sqlite3 import DatabaseError
# from MySQLdb import DatabaseError
from django.core.files.storage import default_storage
from django.http import Http404
from django.shortcuts import render
# from filetype import is_archive
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView, UpdateAPIView, RetrieveAPIView, ListAPIView
from rest_framework.response import Response
import requests
from django.core.files.base import ContentFile
# from utils import months_dict

from Acadix.models import ExceptionTrack, EmployeeMaster, Address, UserType, EmployeeType, State, City, Country, \
    Organization, Branch, Batch, Gender, UserLogin, Designation
from STAFF.models import EmployeeDocument, EmployeeFamilyDetail, EmployeeQualification, EmployeeCourse, \
    EmployeeLanguage, EmployeeExperience
from STAFF.serializers import staffRegistrationserializer, staffRegistrationAddressSerializer, \
    staffRegistrationListDocumentcreateUpdateSerializer, staffRegistrationFamilyDetailsUpdateSerializer, \
    staffRegistrationQualificationDetailsUpdateSerializer, staffRegistrationCourseDetailsUpdateSerializer, \
    staffRegistrationLanguageDetailsSerializer, staffRegistrationExperienceDetailsUpdateSerializer, \
    staffDetailsFilterSerializer
from Swostitech_Acadix import settings

from Acadix.models import Document

# Create your views here.
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from .utils import save_base64_file
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .serializers import staffRegistrationserializer


def sanitize_uploaded_filename(filename):
    """
    Sanitize filename by:
    1. Removing/replacing special characters
    2. Replacing spaces with underscores
    3. Ensuring it's URL-safe
    """
    # Get the name and extension
    name, ext = os.path.splitext(filename)
    
    # Normalize unicode characters
    name = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode('ascii')
    
    # Replace spaces and special chars with underscore
    name = re.sub(r'[^\w\-]', '_', name)
    
    # Remove consecutive underscores
    name = re.sub(r'_+', '_', name)
    
    # Remove leading/trailing underscores
    name = name.strip('_')
    
    # If name is empty after sanitization, use a default
    if not name:
        name = 'profile_' + str(uuid.uuid4())[:8]
    
    return f"{name}{ext}"

class StaffRegistrationBasicInfoCreateAPIView1(APIView):
    def post(self, request, *args, **kwargs):
        serializer = staffRegistrationserializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(staffRegistrationserializer(instance).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class StaffRegistrationBasicInfoCreateAPIView(CreateAPIView):
    serializer_class = staffRegistrationserializer
    parser_classes = (MultiPartParser, FormParser)
    def create(self, request, *args, **kwargs):
        print("content type: ", request.content_type)
        print("data: ", request.data)
        print('file:', request.FILES)
        try:
            serializer= self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Read profile photo
            # Initialize the image path
            # file_path=""
            # upload_image = request.data.get('profile_pic')
            # upload_image = serializer.validated_data.get('profile')
            # if upload_image:
                # file_path = save_base64_file(upload_image)
                # print(file_path)
                # # match = re.search(r'name=([^;]+)', upload_image)
                # # if match:
                # #     file_name = match.group(1)
                # #     print("File name:", file_name)
                # # else:
                # #     file_name = 'profile_pic'+ '_' + str(uuid.uuid4())[:8]
                #
                # # upload_image = request.FILES.get('profile')
                #
                # # Generate a Unique UUID string for upload file & image uniqueness
                # # Generate a unique 8-character string using UUID
                # unique_string = 'profile_pic'+ '_' + str(uuid.uuid4())[:8]
                #
                # # Generate a dynamic folder and file path
                # folder_name = "STAFF_PROFILE_IMAGE"
                #
                # file_name = f"{os.path.splitext(upload_image.name)[0]}_{unique_string}{os.path.splitext(upload_image.name)[1]}"
                # print(os.path)
                # file_path = os.path.join(folder_name, file_name)  # This is the relative file path
                # print(file_path)
                # # filename = 'face.jpeg'
                # # file_path = os.path.join(folder_name, filename)
                # # # Get the full path relative to the media directory
                # full_file_path = os.path.join(settings.MEDIA_ROOT, file_path)
                # print(full_file_path)
                #
                # # filename = 'dummpy.pdf'
                # # file_path = os.path.join(folder_name, filename)  # This is the relative file path
                #
                # # Get the full path relative to the media directory
                # # full_file_path = os.path.join(settings.MEDIA_ROOT, file_path)
                # #
                # # if "base64," in upload_image:
                # #     file_data = upload_image.split("base64,")[1]
                # #
                # # # Decode base64
                # # decoded_file = base64.b64decode(file_data)
                #
                # # Ensure the directory exists
                # if not os.path.exists(os.path.dirname(full_file_path)):
                #     os.makedirs(os.path.dirname(full_file_path))
                #
                # # Save the file
                # # with default_storage.open(full_file_path, 'wb+') as destination:
                # #     for chunk in upload_image.chunks():
                # #         destination.write(chunk)
                # # with open(full_file_path, "wb") as f:
                # #     f.write(decoded_file)

            # Check all active  employee
            try:
                EmployeeMaster_Records = EmployeeMaster.objects.filter(
                    id=request.data.get('id')
                )
            except:
                EmployeeMaster_Records = None
            # Map existing Emplyee by employee_id for fast lookup
            employee_map = {doc.id: doc for doc in EmployeeMaster_Records}
            
            # Get the first available designation (user has already set it up in DB)
            designation_instance = Designation.objects.filter(is_active=True).first()
            
            # create staff
            if EmployeeMaster_Records:
                staffcreateInstance = employee_map[int(request.data.get('id'))]
                staffcreateInstance.organization= serializer.validated_data.get('organization')
                staffcreateInstance.branch = serializer.validated_data.get('branch')
                staffcreateInstance.employee_code = serializer.validated_data.get('employee_code')
                staffcreateInstance.nuid = serializer.validated_data.get('nuid')
                staffcreateInstance.designation = designation_instance
                staffcreateInstance.title = serializer.validated_data.get('title')
                staffcreateInstance.first_name = serializer.validated_data.get('first_name')
                staffcreateInstance.middle_name = serializer.validated_data.get('middle_name')
                staffcreateInstance.last_name = serializer.validated_data.get('last_name')
                staffcreateInstance.date_of_birth = serializer.validated_data.get('date_of_birth')
                staffcreateInstance.place_of_birth =serializer.validated_data.get('place_of_birth')
                staffcreateInstance.marital_status=serializer.validated_data.get('marital_status')
                staffcreateInstance.blood_group = serializer.validated_data.get('blood_group')
                staffcreateInstance.nationality = serializer.validated_data.get('nationality')
                staffcreateInstance.religion = serializer.validated_data.get('religion')
                staffcreateInstance.gender = serializer.validated_data.get('gender')
                staffcreateInstance.mother_tongue = serializer.validated_data.get('mother_tongue')
                staffcreateInstance.employee_type = serializer.validated_data.get('employee_type')
                if serializer.validated_data.get('email'):
                    staffcreateInstance.email = serializer.validated_data.get('email')
                staffcreateInstance.office_email = serializer.validated_data.get('office_email')
                staffcreateInstance.phone_number = serializer.validated_data.get('phone_number')
                staffcreateInstance.emergency_contact_number = serializer.validated_data.get('emergency_contact_number')

                # Update is_active status
                is_active_val = request.data.get('is_active')
                if is_active_val is not None:
                    if str(is_active_val).lower() == 'true':
                        staffcreateInstance.is_active = True
                    else:
                        staffcreateInstance.is_active = False

                # Handle profile picture upload with filename sanitization
                if serializer.validated_data.get('profile_pic'):
                    profile_pic_file = serializer.validated_data.get('profile_pic')
                    # Sanitize the filename before saving
                    original_name = profile_pic_file.name
                    sanitized_name = sanitize_uploaded_filename(original_name)
                    profile_pic_file.name = sanitized_name
                    staffcreateInstance.profile_pic = profile_pic_file
                    print(f"✅ Profile picture sanitized: {original_name} -> {sanitized_name}")
                
                staffcreateInstance.updated_by = serializer.validated_data.get('created_by')
                
                # SAVE FIRST - this writes the file to disk
                staffcreateInstance.save()
                print(f"✅ Staff instance saved with ID: {staffcreateInstance.id}")
                
                # NOW build the URL after the file has been saved
                if staffcreateInstance.profile_pic:
                    staffcreateInstance.profile_photo_path = request.build_absolute_uri(staffcreateInstance.profile_pic.url)
                    staffcreateInstance.save(update_fields=['profile_photo_path'])
                    print(f"✅ Profile photo URL: {staffcreateInstance.profile_photo_path}")
                    print(f"✅ Profile photo file path: {staffcreateInstance.profile_pic.path}")

                response_data = {'message': 'Successfully updated.'}

            elif request.data.get('id'):
                return Response({'message': f'Update failed: Employee with ID {request.data.get("id")} not found.'}, status=status.HTTP_404_NOT_FOUND)

            else:
                # Check if email already exists in UserLogin to prevent 500 error
                email_to_check = serializer.validated_data.get('email')
                if UserLogin.objects.filter(user_name=email_to_check).exists():
                    return Response({'message': f'Email "{email_to_check}" is already associated with an account. Please use a different email.'}, 
                                    status=status.HTTP_400_BAD_REQUEST)

                # Handle profile picture for new staff
                profile_pic_to_save = None
                if serializer.validated_data.get('profile_pic'):
                    profile_pic_file = serializer.validated_data.get('profile_pic')
                    # Sanitize the filename before saving
                    original_name = profile_pic_file.name
                    sanitized_name = sanitize_uploaded_filename(original_name)
                    profile_pic_file.name = sanitized_name
                    profile_pic_to_save = profile_pic_file
                    print(f"✅ Profile picture sanitized: {original_name} -> {sanitized_name}")

                staffcreateInstance = EmployeeMaster.objects.create(
                    organization= serializer.validated_data.get('organization'),
                    branch= serializer.validated_data.get('branch'),
                    batch=serializer.validated_data.get('batch'),
                    # course=serializer.validated_data.get('course'),
                    # department=serializer.validated_data.get('department'),
                    employee_code = serializer.validated_data.get('employee_code'),
                    nuid = serializer.validated_data.get('nuid'),
                    designation=designation_instance,
                    title = serializer.validated_data.get('title'),
                    first_name = serializer.validated_data.get('first_name'),
                    middle_name= serializer.validated_data.get('middle_name'),
                    last_name = serializer.validated_data.get('last_name'),
                    date_of_birth= serializer.validated_data.get('date_of_birth'),
                    date_of_joining= date.today(),
                    place_of_birth= serializer.validated_data.get('place_of_birth'),
                    marital_status = serializer.validated_data.get('marital_status'),
                    blood_group =serializer.validated_data.get('blood_group'),
                    nationality  = serializer.validated_data.get('nationality'),
                    religion = serializer.validated_data.get('religion'),
                    gender = serializer.validated_data.get('gender'),
                    mother_tongue = serializer.validated_data.get('mother_tongue'),
                    employee_type = serializer.validated_data.get('employee_type'),
                    email = serializer.validated_data.get('email'),
                    office_email = serializer.validated_data.get('office_email'),
                    phone_number = serializer.validated_data.get('phone_number'),
                    emergency_contact_number = serializer.validated_data.get('emergency_contact_number'),
                    created_by = serializer.validated_data.get('created_by'),
                    profile_pic = profile_pic_to_save,
                    profile_photo_path =""
                )

                # Build the absolute URL AFTER saving
                if staffcreateInstance.profile_pic:
                    staffcreateInstance.profile_photo_path = request.build_absolute_uri(staffcreateInstance.profile_pic.url)
                    staffcreateInstance.save(update_fields=['profile_photo_path'])
                    print(f"✅ Profile photo URL: {staffcreateInstance.profile_photo_path}")
                    print(f"✅ Profile photo file path: {staffcreateInstance.profile_pic.path}")

                user_type_instance = UserType.objects.get(id=3,is_active=True)

                # # Create Employee Login Instance
                employee_login_instance = UserLogin(
                    user_name=staffcreateInstance.email,
                    password=staffcreateInstance.first_name,
                    plain_password=staffcreateInstance.first_name,  # Consider removing this for security
                    user_type=user_type_instance,
                    reference_id=staffcreateInstance.id,
                    organization=staffcreateInstance.organization,
                    branch=staffcreateInstance.branch,
                    is_active=True,
                    is_staff=True,  # Required for Django admin
                    date_joined=date.today()
                )

                employee_login_instance.set_password(staffcreateInstance.first_name)
                employee_login_instance.save()

                # Create Login instance
                # login_instance = Login(
                #     username=Employee_instance.email,
                #     password=make_password(Employee_instance.first_name),  # Hash the password
                #     employee=Employee_instance,
                #     organization=Employee_instance.organization,
                #     branch=Employee_instance.branch,
                #     is_staff=True,  # Set to True for the default staff user; adjust as needed
                #     is_superuser=False  # Set to False for non-superuser; adjust as needed
                # )
                # login_instance.save()

                # Optionally, return the created employee data
                response_data = {
                    'message': 'Successfully created!!. Note: While login use email_id as a username and firstname as a password',
                    # 'employee': EmployeeSerializer(Employee_instance).data,
                    'login': {
                        'organization_name': staffcreateInstance.organization.organization_code,
                        'branch_name': staffcreateInstance.branch.branch_name,
                        'username': employee_login_instance.user_name,
                        'is_staff': employee_login_instance.is_staff,
                        'is_superuser': False
                    }
                }

            data={
                'employee_id':staffcreateInstance.id,
                'employee_type':staffcreateInstance.employee_type.employee_type_code,
                'login_data': response_data
            }
            return Response({'message':'success','data':data},status=status.HTTP_200_OK)


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
            import traceback
            traceback.print_exc()
            self.log_exception(request, str(e))
            return Response({'error': f'An unexpected error occurred: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def log_exception(self, request, error_message):
        # Truncate error message to prevent exceeding varchar(200) limit
        truncated_message = error_message[:195] + "..." if len(error_message) > 195 else error_message
        ExceptionTrack.objects.create(
            request=str(request)[:195],
            process_name='Staff-Registration-Create',
            message=truncated_message,
        )


class StaffRegistrationAddressCreateUpdateAPIView(UpdateAPIView):
    serializer_class = staffRegistrationAddressSerializer

    def update(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            employee_id= request.query_params.get('employee_id')
            employee_type_id = request.query_params.get('employee_type_id')

            # Get Employee type name
            if organization_id and branch_id and employee_type_id:
                try:
                    employeetypeInstance = EmployeeType.objects.get(organization=organization_id,branch=branch_id,id=employee_type_id,is_active=True)
                except EmployeeType.DoesNotExist:
                    return Response({'message':'employee type not found'},status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"message":"organization_id, branch_id and employee_id is required !!!"},status=status.HTTP_404_NOT_FOUND)


            try:
                # Query by reference_id only to handle employee type changes
                instance = Address.objects.get(reference_id=employee_id, is_active=True)
                # Update usertype in case it changed
                instance.usertype = employeetypeInstance.employee_type_code
            except:
                instance= None

            if instance:
                serializer = self.get_serializer(instance, data=request.data, partial=False)
                serializer.is_valid(raise_exception=True)

                # update employee address
                instance.present_address= serializer.validated_data.get('present_address')
                instance.present_pincode = serializer.validated_data.get('present_pincode')
                instance.present_city = serializer.validated_data.get('present_city')
                instance.present_state = serializer.validated_data.get('present_state')
                instance.present_country = serializer.validated_data.get('present_country')
                instance.present_phone_number = serializer.validated_data.get('present_phone_number')
                instance.permanent_address = serializer.validated_data.get('permanent_address')
                instance.permanent_pincode = serializer.validated_data.get('permanent_pincode')
                instance.permanent_city = serializer.validated_data.get('permanent_city')
                instance.permanent_state = serializer.validated_data.get('permanent_state')
                instance.permanent_country = serializer.validated_data.get('permanent_country')
                instance.permanent_phone_number = serializer.validated_data.get('permanent_phone_number')
                # instance.created_by = serializer.validated_data.get('created_by')
                instance.updated_by = serializer.validated_data.get('updated_by')
                instance.save()
                return Response({'message':'success','employee_id':instance.reference_id},status=status.HTTP_200_OK)
            else:
                # create address for employee
                # get Receive data
                serializer= self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)

                # Create  address
                addressInstance = Address.objects.create(
                    reference_id=employee_id,
                    usertype=employeetypeInstance.employee_type_code,
                    present_address = serializer.validated_data.get('present_address'),
                    present_pincode = serializer.validated_data.get('present_pincode'),
                    present_city = serializer.validated_data.get('present_city'),
                    present_state = serializer.validated_data.get('present_state'),
                    present_country = serializer.validated_data.get('present_country'),
                    present_phone_number = serializer.validated_data.get('present_phone_number'),
                    permanent_address = serializer.validated_data.get('permanent_address'),
                    permanent_pincode = serializer.validated_data.get('permanent_pincode'),
                    permanent_city = serializer.validated_data.get('permanent_city'),
                    permanent_state = serializer.validated_data.get('permanent_state'),
                    permanent_country = serializer.validated_data.get('permanent_country'),
                    permanent_phone_number = serializer.validated_data.get('permanent_phone_number'),
                    created_by = serializer.validated_data.get('created_by'),
                    updated_by = serializer.validated_data.get('updated_by')
                )
                return Response({'message': 'success', 'employee_id': addressInstance.reference_id}, status=status.HTTP_200_OK)

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
            request=str(request),
            process_name='Staff-Address-Create-Update',
            message=error_message,
        )


class StaffRegistrationDocumentCreateUpdateAPIView(UpdateAPIView):
    serializer_class = staffRegistrationListDocumentcreateUpdateSerializer

    def update(self, request, *args, **kwargs):
        data = request.data
        try:
            debug_logs = []
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            employee_id = request.query_params.get('employee_id')

            # ✅ FIX: Use getlist() to capture ALL files sent with the same key name.
            # request.FILES.items() behaves like a dict and returns only ONE entry
            # per key — so multiple files with key "document_files" were silently dropped.
            document_files = request.FILES.getlist("document_files")

            # get employee Instance
            if organization_id and branch_id and employee_id:
                try:
                    EmployeeInstance = EmployeeMaster.objects.get(organization=organization_id,branch=branch_id,id=employee_id,is_active=True)
                except EmployeeMaster.DoesNotExist:
                    return Response({'message':'No Employee Found'},status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"message":"organization_id, branch_id and employee_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)
            # Check all active documents for this employee
            try:
                SCH_EMPLOYEE_DOCUMENTS_Records = EmployeeDocument.objects.filter(
                    organization=organization_id,
                    branch=branch_id,
                    employee_id=employee_id,
                    is_active=True
                )
            except:
                SCH_EMPLOYEE_DOCUMENTS_Records= None

            # Validate incoming data
            # serializer = self.get_serializer(data=request.data)
            # serializer.is_valid(raise_exception=True)
            #
            # document_details = serializer.validated_data.get('document_details', [])

            # Read profile photo
            document_details = data['document_details']
            
            # Handle if it's a list (e.g. from QueryDict with multiple values, or pre-parsed list)
            if isinstance(document_details, list):
                # If it's a list of strings, maybe take the first?
                # If it's a list of dicts, it's already parsed!
                if len(document_details) > 0 and isinstance(document_details[0], (dict, list)):
                    parsed_details = document_details
                elif len(document_details) > 0 and isinstance(document_details[0], str):
                     # Try parsing the first string
                     try:
                        parsed_details = json.loads(document_details[0])
                     except:
                        # Maybe the string IS the JSON (if list wrapper was accidental)
                        parsed_details = json.loads(document_details) 
                else:
                    parsed_details = document_details # Empty or unknown
            elif isinstance(document_details, dict):
                parsed_details = [document_details] # Wrap in list if single dict
            elif isinstance(document_details, (str, bytes, bytearray)):
                parsed_details = json.loads(document_details)
            else:
                parsed_details = []

            # Collect submitted document IDs (existing DB records the user wants to KEEP)
            # New rows have document_details_id=0 so are excluded from this set intentionally
            submitted_doc_ids = {
                int(item.get('document_details_id'))
                for item in parsed_details
                if item.get('document_details_id') and int(item.get('document_details_id')) != 0
            }

            # Map existing docs by document_type_id for fast lookup
            doc_map = {doc.document_type_id: doc for doc in SCH_EMPLOYEE_DOCUMENTS_Records} if SCH_EMPLOYEE_DOCUMENTS_Records else {}

            if SCH_EMPLOYEE_DOCUMENTS_Records:
                # ✅ FIX: Iterate ALL metadata items (not zip which stops at shortest list).
                # Use has_file flag to consume uploaded files in order for docs that have a new upload.
                file_index = 0
                for item in parsed_details:
                    document_type_id = item.get('document_type_id')
                    has_file = item.get('has_file', False)

                    # Get the next uploaded file only if this doc has one
                    doc_file = None
                    if has_file and file_index < len(document_files):
                        doc_file = document_files[file_index]
                        file_index += 1

                    # Try to find existing DB record by document_type_id
                    doc_instance = doc_map.get(document_type_id)

                    if doc_instance:
                        # Update existing record
                        if doc_file:
                            doc_instance.document_file = doc_file
                            doc_instance.document_path = request.build_absolute_uri(doc_instance.document_file.url)
                        doc_instance.document_number = item.get('document_number')
                        doc_instance.valid_from = item.get('valid_from')
                        doc_instance.valid_to = item.get('valid_to')
                        doc_instance.updated_by = data.get('created_by')
                        doc_instance.save()
                        debug_logs.append(f"Updated doc type_id={document_type_id}")
                    else:
                        # No existing record — create new
                        try:
                            new_doc = EmployeeDocument.objects.create(
                                organization=Organization.objects.get(id=organization_id),
                                branch=Branch.objects.get(id=branch_id),
                                employee_id=EmployeeInstance.id,
                                document_type=Document.objects.get(id=document_type_id),
                                document_number=item.get('document_number'),
                                document_file=doc_file,
                                document_path="",
                                valid_from=item.get('valid_from'),
                                valid_to=item.get('valid_to'),
                                created_by=data.get('created_by')
                            )
                            if doc_file:
                                new_doc.refresh_from_db()
                                new_doc.document_path = request.build_absolute_uri(new_doc.document_file.url)
                                new_doc.save()
                            debug_logs.append(f"Created new doc type_id={document_type_id}")
                        except Exception as inner_e:
                            print(f"Error creating new doc: {inner_e}")
                            debug_logs.append(f"Error creating doc: {str(inner_e)}")
            else:
                # ✅ CREATE path: Iterate all metadata items, use has_file flag to pair files in order
                try:
                    print("DEBUG: Creating Documents")
                    print("DEBUG: document_details raw:", document_details)
                    print("DEBUG: request.FILES keys:", list(request.FILES.keys()))
                    print("DEBUG: document_files count:", len(document_files))
                    print("DEBUG: parsed_details count:", len(parsed_details))

                    file_index = 0
                    for item in parsed_details:
                        debug_logs.append(f"Processing item: {item}")
                        document_type_id = item.get('document_type_id')
                        has_file = item.get('has_file', False)

                        # Get the next uploaded file only if this doc has one
                        doc_file = None
                        if has_file and file_index < len(document_files):
                            doc_file = document_files[file_index]
                            file_index += 1

                        try:
                            EmployeeDocumentInstance = EmployeeDocument.objects.create(
                                organization=Organization.objects.get(id=organization_id),
                                branch=Branch.objects.get(id=branch_id),
                                employee_id=EmployeeInstance.id,
                                document_type=Document.objects.get(id=document_type_id),
                                document_number=item.get('document_number'),
                                document_file=doc_file,
                                document_path="",
                                valid_from=item.get('valid_from'),
                                valid_to=item.get('valid_to'),
                                created_by=data.get('created_by')
                            )
                            if doc_file:
                                EmployeeDocumentInstance.refresh_from_db()
                                EmployeeDocumentInstance.document_path = request.build_absolute_uri(EmployeeDocumentInstance.document_file.url)
                                EmployeeDocumentInstance.save()
                            debug_logs.append(f"Saved doc type_id={document_type_id}, path={EmployeeDocumentInstance.document_path}")
                        except Exception as inner_e:
                            print(f"Error saving doc: {inner_e}")
                            debug_logs.append(f"Error: {str(inner_e)}")

                except Exception as e:
                    print(e)
                    debug_logs.append(f"Outer Error: {str(e)}")

            # ✅ Deactivate any existing DB docs whose ID was NOT in the submitted list
            # (i.e. records the user removed from the UI)
            # When all docs removed: submitted_doc_ids=set() → deactivates ALL active docs
            removed_qs = EmployeeDocument.objects.filter(
                organization=organization_id,
                branch=branch_id,
                employee_id=employee_id,
                is_active=True
            ).exclude(document_id__in=submitted_doc_ids)
            removed_count = removed_qs.count()
            removed_qs.update(is_active=False, updated_by=int(data.get('created_by') or 0) or None)
            debug_logs.append(f"Deactivated {removed_count} removed document(s)")

            return Response({'message':'success','employee_id':EmployeeInstance.id, 'debug_logs': debug_logs},status=status.HTTP_200_OK)
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
            request=str(request),
            process_name='Staff-Document-Create-Update',
            message=error_message,
        )


class StaffRegistrationFamilyCreateUpdateAPIView(UpdateAPIView):
    serializer_class = staffRegistrationFamilyDetailsUpdateSerializer

    def update(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            employee_id = request.query_params.get('employee_id')
            # data = json.loads(request.data)

            # get employee Instance

            if organization_id and branch_id and employee_id:
                try:
                    EmployeeInstance = EmployeeMaster.objects.get(id=employee_id,organization=organization_id, branch=branch_id,is_active=True)
                except EmployeeMaster.DoesNotExist:
                    return Response({"message":"No Employee Found !!!"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"message":"organization_id, branch_id and employee_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)

            # try:
            #     EmployeeInstance = EmployeeMaster.objects.get(organization=organization_id,branch=branch_id, id=employee_id, is_active=True)
            # except:
            #     return Response({'message': 'No Employee Found'}, status=status.HTTP_400_BAD_REQUEST)

            # Check all active family Relation for this employee
            try:
                EmployeeFamilyDetailRecords = EmployeeFamilyDetail.objects.filter(
                    organization=organization_id,
                    branch=branch_id,
                    employee=employee_id,
                    is_active=True
                )
            except:
                SCH_FAMILY_DETAILS_Records = None

            # try:
            #     relation_employed = request.data['family_details']['relation_employed']
            # except:
            #     relation_employed = 'N'

            # Validate incoming data
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            family_details = serializer.validated_data.get('family_details', [])

            # Map existing docs by document_type_id for fast lookup
            family_map = {doc.family_detail_id: doc for doc in EmployeeFamilyDetailRecords}
            
            # Identify IDs to keep and delete the rest (Handle Clean up/De-duplication)
            keep_ids = [item.get('family_details_id') for item in family_details if item.get('family_details_id')]
            
            if organization_id and branch_id and employee_id:
                try:
                    # Delete records not in the payload
                    EmployeeFamilyDetail.objects.filter(
                        organization=organization_id,
                        branch=branch_id,
                        employee=employee_id,
                        is_active=True
                    ).exclude(family_detail_id__in=keep_ids).delete()
                except Exception as e:
                    print(f"Error deleting missing family records: {e}")


            for item in family_details:

                family_details_id = item.get('family_details_id')


                if family_details_id in family_map:
                    relation_employed = item.get('relation_employed') if item.get('relation_employed') else 'N'

                    family_instance = family_map[family_details_id]
                    family_instance.employee_relation= item.get('employee_relation')
                    family_instance.relation_title = item.get('relation_title')
                    family_instance.relation_first_name= item.get('relation_first_name')
                    family_instance.relation_middle_name = item.get('relation_middle_name')
                    family_instance.relation_last_name = item.get('relation_last_name')
                    family_instance.relation_dob = item.get('relation_dob')
                    family_instance.relation_gender = item.get('relation_gender')
                    family_instance.relation_marital_status = item.get('relation_marital_status')
                    family_instance.relation_employed = relation_employed
                    family_instance.relation_occupation = item.get('relation_occupation')
                    family_instance.relation_dependent = item.get('relation_dependent')
                    family_instance.relation_pf_nominee = item.get('relation_pf_nominee')
                    family_instance.relation_pf_share = item.get('relation_pf_share')
                    family_instance.updated_by = serializer.validated_data.get('created_by')
                    family_instance.save()

                else:
                    # create document details
                    family_relation_instance = EmployeeFamilyDetail.objects.create(
                        employee=EmployeeInstance,
                        organization=Organization.objects.get(id=organization_id),
                        branch=Branch.objects.get(id = branch_id),
                        employee_relation=item.get('employee_relation'),
                        relation_title=item.get('relation_title'),
                        relation_first_name=item.get('relation_first_name'),
                        relation_middle_name=item.get('relation_middle_name'),
                        relation_last_name=item.get('relation_last_name'),
                        relation_dob=item.get('relation_dob'),
                        relation_gender=item.get('relation_gender'),
                        relation_marital_status=item.get('relation_marital_status'),
                        relation_employed = item.get('relation_employed'),
                        relation_occupation=item.get('relation_occupation'),
                        relation_dependent=item.get('relation_dependent'),
                        relation_pf_nominee=item.get('relation_pf_nominee'),
                        relation_pf_share=item.get('relation_pf_share'),
                        created_by=serializer.validated_data.get('created_by'),
                        updated_by=serializer.validated_data.get('created_by'),

                    )

            return Response({'message': 'success', 'employee_id': EmployeeInstance.id}, status=status.HTTP_200_OK)


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

            request=str(request),

            process_name='Staff-Family-Relation-Create-Update',

            message=error_message,

        )


class StaffRegistrationQualificationCreateUpdateAPIView(UpdateAPIView):
    serializer_class = staffRegistrationQualificationDetailsUpdateSerializer

    def update(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            employee_id = request.query_params.get('employee_id')

            # get employee Instance
            if organization_id and branch_id and employee_id:
                try:
                    EmployeeInstance = EmployeeMaster.objects.get(id=employee_id,organization=organization_id, branch=branch_id,is_active=True)
                except EmployeeMaster.DoesNotExist:
                    return Response({"message":"No Employee Found !!!"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"message":"organization_id, branch_id and employee_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)
            # try:
            #     EmployeeInstance = EmployeeMaster.objects.get(id=employee_id, is_active=True)
            # except:
            #     return Response({'message': 'No Employee Found'}, status=status.HTTP_400_BAD_REQUEST)

            # Check all active family Relation for this employee
            try:
                SCH_EMPLOYEE_QUALIFICATIONS_Records = EmployeeQualification.objects.filter(
                    organization=organization_id,
                    branch=branch_id,
                    employee=employee_id,
                    is_active=True
                )
            except:
                SCH_EMPLOYEE_QUALIFICATIONS_Records = None

            # Validate incoming data
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            qualification_details = serializer.validated_data.get('qualifications_details', [])

            # Map existing docs by document_type_id for fast lookup
            # qualification_map = {doc.employee_qualification_id: doc for doc in SCH_EMPLOYEE_QUALIFICATIONS_Records}
            # qualification_map = [doc for doc in SCH_EMPLOYEE_QUALIFICATIONS_Records]

            if SCH_EMPLOYEE_QUALIFICATIONS_Records:
                for item, qualification in zip(qualification_details,SCH_EMPLOYEE_QUALIFICATIONS_Records):
                # for item in qualification_details:

                    employee_qualification_id = item.get('employee_qualification_id')

                    # if employee_qualification_id in qualification_map:

                    qualification_instance = qualification
                    qualification_instance.qualification_type = item.get('qualification_type')
                    qualification_instance.year_from = item.get('year_from')
                    qualification_instance.year_to = item.get('year_to')
                    qualification_instance.university = item.get('university')
                    qualification_instance.institution = item.get('institution')
                    qualification_instance.marks = item.get('marks')
                    qualification_instance.updated_by = serializer.validated_data.get('created_by')
                    qualification_instance.save()

            else:
                # create document details
                for item in qualification_details:
                    family_relation_instance = EmployeeQualification.objects.create(
                        organization=Organization.objects.get(id=organization_id),
                        branch=Branch.objects.get(id=branch_id),
                        employee=EmployeeInstance,
                        qualification= item.get('qualification'),
                        highest_qualification= item.get('highest_qualification'),
                        date_from = item.get('date_from'),
                        date_to = item.get('date_to'),
                        university = item.get('university'),
                        institution = item.get('institution'),
                        marks = item.get('marks'),
                        created_by=serializer.validated_data.get('created_by'),
                        updated_by=serializer.validated_data.get('created_by'),

                    )

            return Response({'message': 'success', 'employee_id': EmployeeInstance.id}, status=status.HTTP_200_OK)


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

            request=str(request),

            process_name='Staff-Qualification-Create-Update',

            message=error_message,

        )


class StaffRegistrationCourseCreateUpdateAPIView(UpdateAPIView):
    serializer_class = staffRegistrationCourseDetailsUpdateSerializer

    def update(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            employee_id = request.query_params.get('employee_id')

            # get employee Instance
            if organization_id and branch_id and employee_id:
                try:
                    EmployeeInstance = EmployeeMaster.objects.get(id=employee_id,organization=organization_id, branch=branch_id,is_active=True)
                except EmployeeMaster.DoesNotExist:
                    return Response({"message":"No Employee Found !!!"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"message":"organization_id, branch_id and employee_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)
            # try:
            #     EmployeeInstance = EmployeeMaster.objects.get(organization=organization_id,branch=branch_id,id=employee_id, is_active=True)
            # except:
            #     return Response({'message': 'No Employee Found'}, status=status.HTTP_400_BAD_REQUEST)

            # Check all active course for this employee
            try:
                SCH_EMPLOYEE_Course_Records = EmployeeCourse.objects.filter(
                    organization=organization_id,
                    branch=branch_id,
                    employee=employee_id,
                    is_active=True
                )
            except:
                SCH_EMPLOYEE_Course_Records = None

            # Validate incoming data
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            course_details = serializer.validated_data.get('course_details', [])

            # Map existing course in course_id for fast lookup
            # course_map = [doc for doc in SCH_EMPLOYEE_Course_Records]
            # course_map = {doc.course_id: doc for doc in SCH_EMPLOYEE_Course_Records}

            # for item in course_details:
            if SCH_EMPLOYEE_Course_Records:
                for item,course in zip(course_details,SCH_EMPLOYEE_Course_Records):

                    course_id = item.get('course_id')

                    # if course_id in course:
                        # course_instance = course_map[course_id]
                    course_instance = course
                    course_instance.course_name = item.get('course_name')
                    course_instance.course_place = item.get('course_place')
                    course_instance.date_from = item.get('date_from')
                    course_instance.date_to = item.get('date_to')
                    course_instance.valid_upto = item.get('valid_upto')
                    course_instance.course_results = item.get('course_results')
                    course_instance.updated_by = serializer.validated_data.get('created_by')
                    course_instance.save()

            else:
                # create course details
                for item in course_details:
                    course_instance = EmployeeCourse.objects.create(
                        organization=Organization.objects.get(id=organization_id,is_active=True),
                        branch=Branch.objects.get(id=branch_id,is_active=True),
                        employee=EmployeeInstance,
                        course_name= item.get('course_name'),
                        course_place = item.get('course_place'),
                        date_from = item.get('date_from'),
                        date_to = item.get('date_to'),
                        valid_upto = item.get('valid_upto'),
                        course_results= item.get('course_results'),
                        created_by=serializer.validated_data.get('created_by'),
                        updated_by=serializer.validated_data.get('created_by'),

                    )

            return Response({'message': 'success', 'employee_id': EmployeeInstance.id}, status=status.HTTP_200_OK)


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

            request=str(request),

            process_name='Staff-Course-Create-Update',

            message=error_message,

        )

class StaffRegistrationLANGUAGECreateUpdateAPIView(UpdateAPIView):
    serializer_class = staffRegistrationLanguageDetailsSerializer

    def update(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            employee_id = request.query_params.get('employee_id')

            # Validate the incoming data
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Get employee instance
            if organization_id and branch_id and employee_id:
                try:
                    EmployeeInstance = EmployeeMaster.objects.get(id=employee_id,organization=organization_id, branch=branch_id,is_active=True)
                except EmployeeMaster.DoesNotExist:
                    return Response({"message":"No Employee Found !!!"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"message":"organization_id, branch_id and employee_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)
            # try:
            #     employee_instance = EmployeeMaster.objects.get(id=employee_id, is_active=True)
            # except EmployeeMaster.DoesNotExist:
            #     return Response({'message': 'No employee found with given ID.'}, status=status.HTTP_400_BAD_REQUEST)

            language_id = serializer.validated_data.get('employee_language_id', 0)
            language_code = serializer.validated_data.get('language_code')
            created_by = serializer.validated_data.get('created_by')

            # Update existing language record
            if language_id and language_id >= 1:
                try:
                    language_instance = EmployeeLanguage.objects.get(
                        employee_language_id=language_id,
                        is_active=True
                    )
                except EmployeeLanguage.DoesNotExist:
                    return Response({'message': 'Provided employee_language_id does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

                language_instance.language_code = language_code
                language_instance.updated_by = created_by
                language_instance.save()

            else:
                # Create new language record
                EmployeeLanguage.objects.create(
                    organization=Organization.objects.get(id=organization_id),
                    branch=Branch.objects.get(id=branch_id),
                    employee=EmployeeInstance,
                    language_code=language_code,
                    created_by=created_by,
                    updated_by=created_by
                )

            return Response({'message': 'Success', 'employee_id': EmployeeInstance.id}, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            self.log_exception(request, str(e))
            return Response({'error': 'Database error: ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            self.log_exception(request, str(e))
            return Response({'error': 'Unexpected error: ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            process_name='Staff-Language-Create-Update',
            message=error_message,
        )

class StaffRegistrationExperienceCreateUpdateAPIView(UpdateAPIView):
    serializer_class = staffRegistrationExperienceDetailsUpdateSerializer

    def update(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            employee_id = request.query_params.get('employee_id')

            # get employee Instance
            if organization_id and branch_id and employee_id:
                try:
                    EmployeeInstance = EmployeeMaster.objects.get(id=employee_id,organization=organization_id, branch=branch_id,is_active=True)
                except EmployeeMaster.DoesNotExist:
                    return Response({"message":"No Employee Found !!!"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"message":"organization_id, branch_id and employee_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)
            # try:
            #     EmployeeInstance = EmployeeMaster.objects.get(id=employee_id, is_active=True)
            # except:
            #     return Response({'message': 'No Employee Found'}, status=status.HTTP_400_BAD_REQUEST)

            # Check all active Experience for this employee
            try:
                SCH_EMPLOYEE_Experience_Records = EmployeeExperience.objects.filter(
                    organization=organization_id,
                    branch=branch_id,
                    employee=employee_id,
                    is_active=True
                )
            except:
                SCH_EMPLOYEE_Experience_Records = None

            # Validate incoming data
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            experience_details = serializer.validated_data.get('experience_details', [])

            # Map existing course in course_id for fast lookup
            # experience_map = {doc.experience_id: doc for doc in SCH_EMPLOYEE_Experience_Records}
            # experience_map = {doc.experience_id: doc for doc in SCH_EMPLOYEE_Experience_Records}

            if SCH_EMPLOYEE_Experience_Records:
                for experience_detail, experience_record in zip(experience_details,SCH_EMPLOYEE_Experience_Records):
                    experience_instance = experience_record
                    # experience_instance.employee_experience_id = experience_instance.
                    experience_instance.previous_company_worked = experience_detail.get('previous_company_worked')
                    experience_instance.month_year_from = experience_detail.get('month_year_from')
                    experience_instance.month_year_to = experience_detail.get('month_year_to')
                    experience_instance.reason_for_leaving = experience_detail.get('reason_for_leaving')
                    experience_instance.experience_letter_provided = experience_detail.get('experience_letter_provided')
                    experience_instance.updated_by = serializer.validated_data.get('created_by')
                    experience_instance.save()
            else:
                for item in experience_details:

                # experience_id = item.get('experience_id')

                # if SCH_EMPLOYEE_Experience_Records:
                #     experience_instance = SCH_EMPLOYEE_Experience_Records
                #     # experience_instance.employee_experience_id = experience_instance.
                #     experience_instance.previous_company_worked = item.get('previous_company_worked')
                #     experience_instance.month_year_from = item.get('month_year_from')
                #     experience_instance.month_year_to = item.get('month_year_to')
                #     experience_instance.reason_for_leaving = item.get('reason_for_leaving')
                #     experience_instance.experience_letter_provided = item.get('experience_letter_provided')
                #     experience_instance.updated_by = serializer.validated_data.get('created_by')
                #     experience_instance.save()
                #
                # else:
                    # create course details

                    experience_instance = EmployeeExperience.objects.create(
                        employee=EmployeeInstance,
                        organization=Organization.objects.get(id=organization_id),
                        branch=Branch.objects.get(id=branch_id),
                        previous_company_worked= item.get('previous_company_worked'),
                        date_from = item.get('date_from'),
                        date_to = item.get('date_to'),
                        reason_for_leaving = item.get('reason_for_leaving'),
                        experience_letter_provided = item.get('experience_letter_provided'),
                        created_by=serializer.validated_data.get('created_by'),
                        updated_by=serializer.validated_data.get('created_by'),

                    )

            return Response({'message': 'success', 'employee_id': EmployeeInstance.id}, status=status.HTTP_200_OK)


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

            request=str(request),

            process_name='Staff-Experience-Create-Update',

            message=error_message,

        )


class StaffRegistrationDetailsRetrieveAPIView(RetrieveAPIView):
    serializer_class = staffRegistrationserializer

    def retrieve(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            employee_id = request.query_params.get('employee_id')


            if organization_id and branch_id and employee_id:
                try:
                    EmployeeMasterInstance = EmployeeMaster.objects.get(id=employee_id,organization=organization_id, branch=branch_id)
                except EmployeeMaster.DoesNotExist:
                    return Response({"message":"No Employee Found !!!"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"message":"organization_id, branch_id and employee_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)

            # try:
            #     EmployeeMasterInstance = EmployeeMaster.objects.get(organization=organization_id,branch=branch_id,id=employee_id,is_active=True)
            # except:
            #     return Response({'message':'No Record found'},status=status.HTTP_204_NO_CONTENT)

            # construct employee name
            employee_name_parts = filter(
                None,
                [
                    EmployeeMasterInstance.title,
                    EmployeeMasterInstance.first_name,
                    EmployeeMasterInstance.middle_name,
                    EmployeeMasterInstance.last_name,
                ],
            )
            employee_name = " ".join(employee_name_parts)

            # file_path = os.path.join(settings.MEDIA_URL, EmployeeMasterInstance.profile_photo_path)
            # profile = request.build_absolute_uri(file_path)
            # with open(file_path, 'rb') as file:
            #     encoded_file = base64.b64encode(file.read()).decode('utf-8')
            #
            # def image_path_to_base64(photo_path):
            #     try:
            #         full_path = os.path.join(settings.MEDIA_ROOT, photo_path)
            #         with open(full_path, 'rb') as image_file:
            #             return base64.b64encode(image_file.read()).decode('utf-8')
            #     except Exception:
            #         return None

            data={
                'id': EmployeeMasterInstance.id,
                'employee_name': employee_name,
                'title': EmployeeMasterInstance.title,
                'first_name':EmployeeMasterInstance.first_name,
                'middle_name':EmployeeMasterInstance.middle_name,
                'last_name':EmployeeMasterInstance.last_name,
                'employee_code': EmployeeMasterInstance.employee_code,
                'nuid': EmployeeMasterInstance.nuid,
                'date_of_birth': EmployeeMasterInstance.date_of_birth,
                'marital_status': EmployeeMasterInstance.marital_status,
                'gender': EmployeeMasterInstance.gender.gender_name,
                'gender_id': EmployeeMasterInstance.gender.id,
                'nationality': EmployeeMasterInstance.nationality.nationality_code,
                'religion': EmployeeMasterInstance.religion.religion_code,
                'email': EmployeeMasterInstance.email,
                'phone_number': EmployeeMasterInstance.phone_number,
                'office_email': EmployeeMasterInstance.office_email,
                'employee_type': EmployeeMasterInstance.employee_type.employee_type_description,
                'employee_type_id': EmployeeMasterInstance.employee_type.id,
                'date_of_joining': EmployeeMasterInstance.date_of_joining,
                'date_of_leaving': EmployeeMasterInstance.date_of_leaving,
                'payroll_group': EmployeeMasterInstance.payroll_group,
                'place_of_birth': EmployeeMasterInstance.place_of_birth,
                'blood_group': EmployeeMasterInstance.blood_group.blood_name,
                'highest_qualification': EmployeeMasterInstance.highest_qualification,
                'emergency_contact_number': EmployeeMasterInstance.emergency_contact_number,
                'mother_tongue': EmployeeMasterInstance.mother_tongue.mother_tongue_name,
                'mother_tongue_id': EmployeeMasterInstance.mother_tongue.id,
                'is_active': EmployeeMasterInstance.is_active,
                'profile':EmployeeMasterInstance.profile_photo_path
                # 'profile':profile
            }

            return Response({'message':'Success','data':data},status=status.HTTP_200_OK)



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

            process_name='Staff-Basic-Details-Retrieve',

            message=error_message,

        )


class Sch_fnd_district:
    pass


class StaffAddressDetailsRetrieveAPIView(RetrieveAPIView):
    serializer_class = staffRegistrationserializer

    def retrieve(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            employee_id = request.query_params.get('employee_id')
            employee_type = request.query_params.get('employee_type_id')

            # Get Employee type name
            try:
                employeetypeInstance = EmployeeType.objects.get(organization=organization_id,branch=branch_id,id=employee_type)
            except:
                return Response({'message': 'employee type not found'}, status=status.HTTP_400_BAD_REQUEST)


            try:
                # Query by reference_id only, not by usertype
                # This allows address to be retrieved even when employee_type is changed in the form
                addressinstance = Address.objects.get(reference_id=employee_id, is_active=True)

            except:
                addressinstance = None


            if addressinstance:
                # try:
                #     present_state = State.objects.get(state_name__iexact=addressinstance.present_state).state_code
                # except:
                #     present_state = addressinstance.present_state if addressinstance else ""
                #
                # try:
                #     present_district = City.objects.get(id=addressinstance.present_city).city_name
                # except:
                #     present_district = addressinstance.present_city if addressinstance else ""
                #
                # try:
                #     permanent_district = City.objects.get(id=addressinstance.permanent_city).city_name
                # except:
                #     permanent_district = addressinstance.permanent_city if addressinstance else ""
                #
                # try:
                #     permanent_country = Country.objects.get(id=addressinstance.permanent_country).country_code
                # except:
                #     permanent_country = addressinstance.permanent_country if addressinstance else ""
                #
                # try:
                #     permanent_state = State.objects.get(id=addressinstance.permanent_state).state_code
                # except:
                #     permanent_state = addressinstance.permanent_state if addressinstance else ""


                data={
                    'reference_id': addressinstance.reference_id if addressinstance else None,
                    'usertype': addressinstance.usertype if addressinstance else "",
                    'present_address': addressinstance.present_address if addressinstance else "",
                    'present_pincode': addressinstance.present_pincode if addressinstance else "",
                    'present_city': addressinstance.present_city if addressinstance else "",
                    # 'present_district': Sch_fnd_district.objects.get(id=addressinstance.present_district).district_code if addressinstance else "",
                    'present_state': addressinstance.present_state if addressinstance else "",
                    'present_country': addressinstance.present_country if addressinstance else "",
                    'present_phone_number': addressinstance.present_phone_number if addressinstance else "",
                    'permanent_address': addressinstance.permanent_address if addressinstance else "",
                    'permanent_pincode': addressinstance.permanent_pincode if addressinstance else "",
                    'permanent_city': addressinstance.permanent_city if addressinstance else "",
                    'permanent_state':  addressinstance.permanent_state if addressinstance else "",
                    'permanent_country':  addressinstance.permanent_country if addressinstance else "",
                    'permanent_phone_number': addressinstance.permanent_phone_number if addressinstance else "",

                }
            else:
                data = {'msg': "data not found"}
            return Response({'message':'Success','data':data},status=status.HTTP_200_OK)



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

            process_name='Staff-Address-Retrieve',

            message=error_message,

        )


class StaffDocumentDetailsRetrieveAPIView(RetrieveAPIView):
    serializer_class = staffRegistrationserializer

    def retrieve(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            employee_id = request.query_params.get('employee_id')



            # get Documents

            if organization_id and branch_id and employee_id:
                try:
                    documentinstance = EmployeeDocument.objects.filter(employee=employee_id,organization=organization_id, branch=branch_id,is_active=True)
                except EmployeeDocument.DoesNotExist:
                    return Response({"message":"No Employee Found !!!"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"message":"organization_id, branch_id and employee_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)

            # try:
            #     documentinstance = EmployeeDocument.objects.filter(organization=organization_id,branch=branch_id,employee=employee_id,
            #                                               is_active=True)
            # except:
            #     documentinstance = None


            # def image_path_to_base64(file_path):
            #     file_path = os.path.join(settings.MEDIA_URL, file_path)
            #     url = request.build_absolute_uri(file_path)
            #     return url

            responsedata=[]
            for item in documentinstance:
                name_parts = filter(
                    None,
                    [
                        item.employee.title,
                        item.employee.first_name,
                        item.employee.middle_name,
                        item.employee.last_name,
                    ],
                )
                employee_name = " ".join(name_parts)
                data = {
                    'employee_id': item.employee.id,
                    'employee_name':employee_name,
                    'document_id': item.document_id,
                    'document_type_id': item.document_type.id,
                    'document_name': item.document_type.document_code,
                    'document_number': item.document_number,
                    'valid_from': item.valid_from,
                    'valid_to':item.valid_to,
                    'is_active': item.is_active,
                    'document_path': request.build_absolute_uri(item.document_file.url) if item.document_file else (item.document_path if item.document_path else "")
                    # 'document_path':  image_path_to_base64(item.document_path) if item.document_path else None

                }
                responsedata.append(data)

            if responsedata:

                return Response({'message': 'Success', 'data': responsedata}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Success', 'data':'No Record found'}, status=status.HTTP_204_NO_CONTENT)

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

            process_name='Staff-Document-Retrieve',

            message=error_message,

        )


class StaffFamilyDetailsRetrieveAPIView(RetrieveAPIView):
    serializer_class = staffRegistrationserializer

    def retrieve(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            employee_id = request.query_params.get('employee_id')



            # get Documents

            if organization_id and branch_id and employee_id:
                try:
                    familyinstance = EmployeeFamilyDetail.objects.filter(employee=employee_id,organization=organization_id, branch=branch_id,is_active=True)
                except EmployeeFamilyDetail.DoesNotExist:
                    return Response({"message":"No Employee Found !!!"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"message":"organization_id, branch_id and employee_id is required !!!"}, status=status.HTTP_404_NOT_FOUND)

            # try:
            #     familyinstance = EmployeeFamilyDetail.objects.filter(employee_id=employee_id,
            #                                               is_active=True)
            # except:
            #     familyinstance = None




            responsedata=[]
            for item in familyinstance:
                # construct employee reation
                relation_name_parts = filter(
                    None,
                    [
                        item.relation_title,
                        item.relation_first_name,
                        item.relation_middle_name,
                        item.relation_last_name,
                    ],
                )
                relation_name = " ".join(relation_name_parts)
                try:
                    relation_employed = item.relation_employed
                except:
                    relation_employed = None
                data = {
                    'family_details_id': item.family_detail_id,
                    'employee_relation': item.employee_relation,
                    'employee_relation_name': relation_name,
                    'relation_dob': item.relation_dob,
                    'relation_gender': item.relation_gender.gender_name,
                    'relation_gender_id': item.relation_gender.id,
                    'relation_marital_status':item.relation_marital_status,
                    'relation_occupation':  item.relation_occupation,
                    'relation_dependent': item.relation_dependent,
                    'relation_pf_nominee': item.relation_pf_nominee,
                    'relation_pf_share': item.relation_pf_share,
                    'relation_title': item.relation_title,
                    'relation_first_name': item.relation_first_name,
                    'relation_middle_name' : item.relation_middle_name,
                    'relation_last_name' : item.relation_last_name,
                    'relation_employed': relation_employed
                }
                responsedata.append(data)

            if responsedata:

                return Response({'message': 'Success', 'data': responsedata}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Success', 'data':'No Record found'}, status=status.HTTP_204_NO_CONTENT)

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

            process_name='Staff-Relation-Retrieve',

            message=error_message,

        )


class StaffEducationDetailsRetrieveAPIView(RetrieveAPIView):
    serializer_class = staffRegistrationserializer

    def retrieve(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            employee_id = request.query_params.get('employee_id')



            if organization_id and branch_id and employee_id:
                try:
                    qualification_instance = EmployeeQualification.objects.filter(employee=employee_id,
                                                                         organization=organization_id, branch=branch_id,
                                                                         is_active=True)
                except EmployeeQualification.DoesNotExist:
                    return Response({"message": "No Employee Found !!!"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"message": "organization_id, branch_id and employee_id is required !!!"},
                                status=status.HTTP_404_NOT_FOUND)
            # try:
            #     Employeeinstance = EmployeeQualification.objects.filter(employee_id=employee_id,
            #                                               is_active=True)
            # except:
            #     Employeeinstance = None




            responsedata=[]
            for item in qualification_instance:


                data = {
                   'qualification_id': item.employee_qualification_id,
                    'qualification': item.qualification,
                    'date_from': item.date_from,
                    'date_to': item.date_to,
                    'university': item.university,
                    'institution':item.institution,
                    'marks':  item.marks,
                    'highest_qualification':item.highest_qualification

                }
                responsedata.append(data)

            if responsedata:

                return Response({'message': 'Success', 'data': responsedata}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No Record found'}, status=status.HTTP_204_NO_CONTENT)

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

            process_name='Staff-Education-Retrieve',

            message=error_message,

        )

class StaffCourseDetailsRetrieveAPIView(RetrieveAPIView):
    serializer_class = staffRegistrationserializer

    def retrieve(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            employee_id = request.query_params.get('employee_id')

            if organization_id and branch_id and employee_id:
                try:
                    course_instance = EmployeeCourse.objects.filter(employee=employee_id,
                                                                                  organization=organization_id,
                                                                                  branch=branch_id,
                                                                                  is_active=True)
                except EmployeeCourse.DoesNotExist:
                    return Response({"message": "No Employee Found !!!"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"message": "organization_id, branch_id and employee_id is required !!!"},
                                status=status.HTTP_404_NOT_FOUND)



            # get Documents
            # try:
            #     Courseinstance = EmployeeCourse.objects.filter(employee_id=employee_id,
            #                                               is_active=True)
            # except:
            #     Courseinstance = None




            responsedata=[]
            for item in course_instance:


                data = {
                   'course_id': item.employee_course_id,
                    'course_name': item.course_name,
                    'course_place': item.course_place,
                    'date_from': item.date_from,
                    'date_to': item.date_to,
                    'valid_upto':item.valid_upto,
                    'course_results':  item.course_results,


                }
                responsedata.append(data)

            if responsedata:

                return Response({'message': 'Success', 'data': responsedata}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No Record found'}, status=status.HTTP_204_NO_CONTENT)

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

            process_name='Staff-Course-Retrieve',

            message=error_message,

        )

class StaffLanguageDetailsRetrieveAPIView(RetrieveAPIView):
    serializer_class = staffRegistrationserializer

    def retrieve(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            employee_id = request.query_params.get('employee_id')

            if organization_id and branch_id and employee_id:
                try:
                    language_instance = EmployeeLanguage.objects.filter(
                        employee=employee_id,
                        organization=organization_id,
                        branch=branch_id,
                        is_active=True
                    ).first()
                    
                    if not language_instance:
                        return Response({"message": "No Record found"}, status=status.HTTP_204_NO_CONTENT)
                except Exception as e:
                     raise e
            else:
                return Response({"message": "organization_id, branch_id and employee_id is required !!!"},
                                status=status.HTTP_404_NOT_FOUND)


            # try:
            #     EmployeeLanguageInstance = EmployeeLanguage.objects.get(employee_id=employee_id,is_active=True)
            # except:
            #     return Response({'message':'success','data':'No Record found'},status=status.HTTP_204_NO_CONTENT)




            data={
                'employee_id': language_instance.employee.id,
                'employee_language_id': language_instance.employee_language_id,
                'language_code': language_instance.language_code,

            }

            return Response({'message':'Success','data':data},status=status.HTTP_200_OK)



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

            process_name='Staff-Language-Details-Retrieve',

            message=error_message,

        )

class StaffExperienceDetailsRetrieveAPIView(RetrieveAPIView):
    serializer_class = staffRegistrationserializer

    def retrieve(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            employee_id = request.query_params.get('employee_id')

            if organization_id and branch_id and employee_id:
                try:
                    experience_instance = EmployeeExperience.objects.filter(employee=employee_id,
                                                                     organization=organization_id,
                                                                     branch=branch_id,
                                                                     is_active=True)
                except EmployeeExperience.DoesNotExist:
                    return Response({"message": "No Employee Found !!!"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"message": "organization_id, branch_id and employee_id is required !!!"},
                                status=status.HTTP_404_NOT_FOUND)



            # # get Documents
            # try:
            #     Experienceinstance = EmployeeExperience.objects.filter(employee_id=employee_id,
            #                                               is_active=True)
            # except:
            #     Experienceinstance = None




            responsedata=[]
            for item in experience_instance:


                data = {
                   'experience_id': item.employee_experience_id,
                    'previous_company_worked': item.previous_company_worked,
                    'date_from': item.date_from,
                    'date_to': item.date_to,
                    'reason_for_leaving': item.reason_for_leaving,
                    'experience_letter_provided':item.experience_letter_provided



                }
                responsedata.append(data)

            if responsedata:

                return Response({'message': 'Success', 'data': responsedata}, status=status.HTTP_200_OK)
            else:
                return Response({'data':'No Record found'}, status=status.HTTP_204_NO_CONTENT)

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

            process_name='Staff-Experience-Retrieve',

            message=error_message,

        )

class EmployeeDetailsListAPIView(ListAPIView):
    serializer_class = staffDetailsFilterSerializer

    def list(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.query_params)
            serializer.is_valid(raise_exception=True)

            # Get Validate data
            organization_id= serializer.validated_data.get('organization_id')
            branch_id= serializer.validated_data.get('branch_id')
            # batch_id= serializer.validated_data.get('batch_id')
            employee_code= serializer.validated_data.get('employee_code')
            first_name = serializer.validated_data.get('first_name')
            middle_name = serializer.validated_data.get('middle_name')
            last_name= serializer.validated_data.get('last_name')
            employee_type = serializer.validated_data.get('employee_type')

            try:
                filterdata = EmployeeMaster.objects.filter(organization=organization_id,
                                                               branch_id=branch_id,
                                                               is_active=True)
            except:
                filterdata=None

            if filterdata:
                if employee_code:
                    filterdata= filterdata.filter(employee_code=employee_code)
                if first_name:
                    filterdata=filterdata.filter(first_name=first_name)
                if middle_name:
                    filterdata=filterdata.filter(middle_name=middle_name)
                if last_name:
                    filterdata=filterdata.filter(last_name=last_name)
                if employee_type:
                    filterdata=filterdata.filter(employee_type=employee_type)

                # Iterate Filter Record If Preasent
                if filterdata:
                    responsedata=[]
                    for item in filterdata:
                        # construct employee name
                        employee_name_parts = filter(
                            None,
                            [
                                item.title,
                                item.first_name,
                                item.middle_name,
                                item.last_name,
                            ],
                        )
                        employee_name = " ".join(employee_name_parts)

                        data={
                            'id':item.id,
                            'employee_code': item.employee_code,
                            'employee_name':employee_name,
                            'date_of_birth': item.date_of_birth,
                            'employee_type':item.employee_type.employee_type_description,
                            'phone_number': item.phone_number,
                            'email': item.email,
                            'date_of_joining': item.date_of_joining
                        }
                        responsedata.append(data)

                    return Response({'message':'success','data':responsedata},status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'No Record Found'}, status=status.HTTP_204_NO_CONTENT)

            else:
                return Response({'message':'No Record Found'},status=status.HTTP_204_NO_CONTENT)

        except ValidationError as e:
            return Response({'message':e.detail},status=status.HTTP_400_BAD_REQUEST)


        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(

            request=str(request),

            process_name='Staff-List',

            message=error_message,

        )


# class EmployeeTypeListAPIView(ListAPIView):
#     queryset = SCH_EMPLOYEE_TYPE.objects.filter(is_active=True)
#     serializer_class = staffEmployeeTypeSerializer
#
#     def list(self, request, *args, **kwargs):
#         try:
#             response = super().list(request, *args, **kwargs)
#             resdata = response.data
#
#             # prepare data from response
#
#             if resdata:
#                 responsedata = []
#                 for item in resdata:
#                     # Prepare the custom response data
#                     responsedata.append({
#                         'employee_type_id': item.get('employee_type_id'),
#                         'employee_type': item.get('employee_type'),
#                         'employee_type_desc': item.get('employee_type_desc')
#
#                     })
#
#                 if responsedata:
#
#                     return Response({'message': 'Success', 'data': responsedata}, status=status.HTTP_200_OK)
#                 else:
#                     return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)
#
#             else:
#                 return Response({'message': 'No Record Found!'}, status=status.HTTP_200_OK)
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
#
#         ExceptionTrack.objects.create(
#
#             request=str(request),
#
#             process_name='EmployeeTypelist',
#
#             message=error_message,
#
#         )
