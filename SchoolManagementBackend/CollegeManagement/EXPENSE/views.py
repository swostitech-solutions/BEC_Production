from datetime import datetime, timedelta

from django.core.exceptions import ObjectDoesNotExist
from django.db import DatabaseError, transaction
from django.db.models import Max, Exists, OuterRef, Q, Sum, Count, Min
from django.http import Http404
from django.shortcuts import render
from django.utils.timezone import make_aware
from django.utils import timezone

from rest_framework import status

from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView, RetrieveAPIView
from rest_framework.response import Response

from Acadix.models import Organization, Batch, ExceptionTrack, City, State, Country, \
    Bank, BankAccountDetail, AcademicYear, StudentFeeReceiptDetail, StudentFeeReceiptHeader, \
    PaymentMethod, StudentPayment, StudentCourse
from EXPENSE.models import ExpenseCategoryMaster, PartyMaster, ExpenseHeader, ExpenseDetail, ExpensePayment, \
    ExpensePaymentDetail, OtherIncome, OtherIncomeDetail
from EXPENSE.serializers import ExpenseCategoryMasterSerializer, ExpenseCategoryMasterUpdateSerializer, \
    PartyMasterSerializer, PartyMasterUpdateSerializer, PartyMasterSearchSerializer, ExpenseHeaderSerializer, \
    ExpenseAddSerializer, ExpenseIncomeCategoryList, ExpenseSearchSerializer, OtherIncomeSerializer, \
    AddIncomeSerializer, IncomeSearchSerializer, AddIncomeUpdateSerializer, ExpenseUpdateSerializer, \
    ProfitLossSerializer, DayBookSerializer, ExpenseLedgerSerializer


# Create your views here.

class ExpenseIncomeCategoryCreateAPIView(CreateAPIView):
    serializer_class = ExpenseCategoryMasterSerializer

    def create(self, request, *args, **kwargs):
        try:
            # Map branch_id (sent as batch) to actual batch_id
            data = request.data.copy()
            provided_batch_id = data.get('batch')
            if provided_batch_id:
                try:
                    actual_batch = Batch.objects.filter(branch_id=provided_batch_id, is_active=True).first()
                    if actual_batch:
                        data['batch'] = actual_batch.id
                except Exception:
                    pass

            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)

            # Get Validate Data
            expense_category = serializer.validated_data.get('expense_category')
            organization = serializer.validated_data.get('organization')
            batch = serializer.validated_data.get('batch')
            enabled = serializer.validated_data.get('enabled')
            category_type = serializer.validated_data.get('category_type')
            created_by = serializer.validated_data.get('created_by')

            # get Org & Batch Instance
            try:
                OrganizationInstance = Organization.objects.get(id=organization.id, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Organization Id does Not Exist'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                BatchInstance = Batch.objects.get(id=batch.id, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Batch Id does Not Exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Expense & Income category Create

            ExpenseIncomeCategoryInstance = ExpenseCategoryMaster.objects.create(

                expense_category=expense_category,
                organization=OrganizationInstance,
                batch=BatchInstance,
                enabled=enabled,
                category_type=category_type,
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

        ExceptionTrack.objects.create(

            request=str(request)[:100],

            process_name='ExpenseIncomeCategoryCreate',

            message=error_message[:200],

            data='',

        )


class ExpenseIncomeCategoryListAPIView(ListAPIView):
    queryset = ExpenseCategoryMaster.objects.filter(is_active=True)
    serializer_class = ExpenseCategoryMasterSerializer

    def list(self, request, *args, **kwargs):
        try:
            # response = super().list(request,*kwargs)
            # resdata= response.data

            organization_id = request.query_params.get('organization_id')
            batch_id = request.query_params.get('batch_id')

            # Correctly handle branch_id -> batch_id mapping for list filtering
            if batch_id:
               try:
                   actual_batch = Batch.objects.filter(branch_id=batch_id, is_active=True).first()
                   if actual_batch:
                       batch_id = actual_batch.id
               except Exception:
                   pass

            resdata = ExpenseCategoryMaster.objects.filter(organization=organization_id, batch=batch_id)

            if resdata:
                responsedata = []

                for item in resdata:

                    # get Org & Batch Instance
                    try:
                        OrganizationInstance = Organization.objects.get(id=item.organization.id, is_active=True)
                    except ObjectDoesNotExist:
                        return Response({'message': 'Organization Id does Not Exist'},
                                        status=status.HTTP_400_BAD_REQUEST)

                    try:
                        BatchInstance = Batch.objects.get(id=item.batch.id, is_active=True)
                    except ObjectDoesNotExist:
                        return Response({'message': 'Batch Id does Not Exist'}, status=status.HTTP_400_BAD_REQUEST)

                    responsedata.append({
                        'expense_category_id': item.expense_category_id,
                        'expense_category': item.expense_category,
                        'organization': OrganizationInstance.id,
                        'organizationName': OrganizationInstance.organization_code,
                        'batch_id': BatchInstance.id,
                        'batch_name': BatchInstance.batch_code,
                        'enabled': item.enabled,
                        'category_type': item.category_type,
                        'category_flag': item.category_flag,

                    })

                if responsedata:
                    return Response({'message': 'success', 'data': responsedata}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'No Record Found!'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({'message': 'No Record Found!', 'data': []}, status=status.HTTP_200_OK)



        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            processname='ExpenseIncomeCategoryList',

            message=error_message,

        )


class ExpenseIncomeCategoryUpdateAPIView(UpdateAPIView):
    queryset = ExpenseCategoryMaster.objects.all()
    serializer_class = ExpenseCategoryMasterUpdateSerializer

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            ExpenseIncomeInstance = self.get_object()

            # validate input data
            data = request.data.copy()
            provided_batch_id = data.get('batch')
            if provided_batch_id:
                try:
                     actual_batch = Batch.objects.filter(branch_id=provided_batch_id, is_active=True).first()
                     if actual_batch:
                         data['batch'] = actual_batch.id
                except Exception:
                    pass

            serializer = self.get_serializer(ExpenseIncomeInstance, data=data, partial=partial)
            serializer.is_valid(raise_exception=True)

            # expense_category_id = request.data.get('expense_category_id')
            expense_category = serializer.validated_data.get('expense_category')
            organization = serializer.validated_data.get('organization').id
            batch = serializer.validated_data.get('batch').id
            enabled = serializer.validated_data.get('enabled')
            category_type = serializer.validated_data.get('category_type')
            updated_by = serializer.validated_data.get('updated_by')

            try:
                OrganizationInstance = Organization.objects.get(id=organization, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Organization Id does Not Exist'},
                                status=status.HTTP_400_BAD_REQUEST)

            try:
                BatchInstance = Batch.objects.get(id=batch, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Batch Id does Not Exist'}, status=status.HTTP_400_BAD_REQUEST)

            # update the record
            ExpenseIncomeInstance.expense_category = expense_category
            ExpenseIncomeInstance.enabled = enabled
            ExpenseIncomeInstance.organization = OrganizationInstance
            ExpenseIncomeInstance.batch = BatchInstance
            ExpenseIncomeInstance.category_type = category_type
            ExpenseIncomeInstance.updated_by = updated_by

            ExpenseIncomeInstance.save()

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

            request=str(request)[:100],

            process_name='ExpenseIncomeCategoryUpdate',

            message=error_message[:200],

            data='',

        )


class PartyMasterCreateAPIView(CreateAPIView):
    serializer_class = PartyMasterSerializer

    def create(self, request, *args, **kwargs):
        try:
            # Create a mutable copy of the data
            data = request.data.copy()
            
            # Frontend sends branch_id as 'batch'. We need to map it to the actual Batch ID.
            provided_batch_id = data.get('batch')
            if provided_batch_id:
                try:
                    # Find a Batch associated with this Branch
                    # We pick the first active batch found for this branch
                    actual_batch = Batch.objects.filter(branch_id=provided_batch_id, is_active=True).first()
                    if actual_batch:
                        data['batch'] = actual_batch.id
                    # If no batch found, we leave it as is, and serializer validation will likely fail or handle it
                except Exception as e:
                    pass

            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)

            # get validate data

            party_name = serializer.validated_data.get('party_name')
            customer_supplier = serializer.validated_data.get('customer_supplier')
            enabled = serializer.validated_data.get('enabled')
            address = serializer.validated_data.get('address')
            cityId = serializer.validated_data.get('city')
            stateId = serializer.validated_data.get('state')
            country_codeId = serializer.validated_data.get('country')
            organization = serializer.validated_data.get('organization')
            batch_id = serializer.validated_data.get('batch')
            gst_no = serializer.validated_data.get('gst_no')
            phone = serializer.validated_data.get('phone')
            email_id = serializer.validated_data.get('email_id')
            created_by = serializer.validated_data.get('created_by')

            # Get Instance Org & branch & city & state & country Instance

            try:
                OrganizationInstance = Organization.objects.get(id=organization.id, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Organization Id does Not Exist'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                BatchInstance = Batch.objects.get(id=batch_id.id, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Batch Id does Not Exist'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                CityInstance = City.objects.get(id=cityId.id, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'City Id does Not Exist'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                StateInstance = State.objects.get(id=stateId.id, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'State Id does Not Exist'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                CountryInstance = Country.objects.get(id=country_codeId.id, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Country Id does Not Exist'}, status=status.HTTP_400_BAD_REQUEST)

            # Party Master Create
            partymasterInstance = PartyMaster.objects.create(
                party_name=party_name,
                customer_supplier=customer_supplier,
                enabled=enabled,
                address=address,
                city=CityInstance,
                state=StateInstance,
                country=CountryInstance,
                organization=OrganizationInstance,
                batch=BatchInstance,
                gst_no=gst_no,
                phone=phone,
                email_id=email_id,
                created_by=created_by,
                updated_by=created_by

            )

            return Response({'message': 'success'}, status=status.HTTP_200_OK)


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

            processname='PartyMasterCreate',

            message=error_message,

        )


class PartyMasterListAPIView(ListAPIView):
    serializer_class = PartyMasterSerializer

    def list(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            batch_id = request.query_params.get('batch_id')

            # Frontend sends branch_id as 'batch_id'. We need to map it to the actual Batch ID.
            if batch_id:
                try:
                    actual_batch = Batch.objects.filter(branch_id=batch_id, is_active=True).first()
                    if actual_batch:
                        batch_id = actual_batch.id
                except Exception:
                    pass

            # Get Party List based on OrgId & BatchId
            try:
                PartyMasterRecord = PartyMaster.objects.filter(
                    organization_id=int(organization_id),
                    batch_id=int(batch_id),
                    is_active=True
                )
            except (ValueError, TypeError):
                PartyMasterRecord = None

            if PartyMasterRecord:
                responseData = []
                for item in PartyMasterRecord:
                    data = {
                        'party_id': item.party_id,
                        'party_name': item.party_name,
                        'customer_supplier': item.customer_supplier,
                        'enabled': item.enabled,
                        'address': item.address,
                        'cityId': item.city.id if item.city else None,
                        'city_name': item.city.city_name if item.city else None,
                        'stateCodeId': item.state.id if item.state else None,
                        'state': item.state.state_name if item.state else None,
                        'countrycodeId': item.country.id if item.country else None,
                        'country_code': item.country.country_code if item.country else None,
                        'organization_id': item.organization.id,
                        'organization_code': item.organization.organization_code,
                        'batch_id': item.batch.id,
                        'batch_name': item.batch.batch_code,
                        'gst_no': item.gst_no,
                        'phone': item.phone,
                        'email_id': item.email_id,
                        'party_flag': item.party_flag
                    }

                    responseData.append(data)
                return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No Record Found!', 'data': []}, status=status.HTTP_200_OK)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            processname='PartyMasterList',

            message=error_message,

        )


class PartyMasterRetrieveAPIView(RetrieveAPIView):
    serializer_class = PartyMasterSerializer

    def retrieve(self, request, *args, **kwargs):
        try:
            party_id = request.query_params.get('party_id')

            # Get Party Record
            try:
                PartyMasterInstance = PartyMaster.objects.get(party_id=int(party_id), is_active=True)
            except (ObjectDoesNotExist, ValueError, TypeError):
                return Response({'message': 'provided Party Id Not found!'}, status=status.HTTP_200_OK)

            if PartyMasterInstance:
                data = {
                    'party_id': PartyMasterInstance.party_id,
                    'party_name': PartyMasterInstance.party_name,
                    'customer_supplier': PartyMasterInstance.customer_supplier,
                    'enabled': PartyMasterInstance.enabled,
                    'address': PartyMasterInstance.address,
                    'cityId': PartyMasterInstance.city.id if PartyMasterInstance.city else None,
                    'city_name': PartyMasterInstance.city.city_name if PartyMasterInstance.city else None,
                    'stateCodeId': PartyMasterInstance.state.id if PartyMasterInstance.state else None,
                    'state': PartyMasterInstance.state.state_name if PartyMasterInstance.state else None,
                    'countrycodeId': PartyMasterInstance.country.id if PartyMasterInstance.country else None,
                    'country_code': PartyMasterInstance.country.country_code if PartyMasterInstance.country else None,
                    'organization_id': PartyMasterInstance.organization.id,
                    'organization_code': PartyMasterInstance.organization.organization_code,
                    'batch_id': PartyMasterInstance.batch.id,
                    'batch_name': PartyMasterInstance.batch.batch_code,
                    'gst_no': PartyMasterInstance.gst_no,
                    'phone': PartyMasterInstance.phone,
                    'email_id': PartyMasterInstance.email_id,
                    'party_flag': PartyMasterInstance.party_flag
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

            processname='PartyMasterRetrieve',

            message=error_message,

        )


class PartyMasterUpdateAPIView(UpdateAPIView):
    queryset = PartyMaster.objects.all()
    serializer_class = PartyMasterUpdateSerializer

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            PartyMasterInstance = self.get_object()

            # validate input data
            data = request.data.copy()
            provided_batch_id = data.get('batch')
            if provided_batch_id:
                try:
                     actual_batch = Batch.objects.filter(branch_id=provided_batch_id, is_active=True).first()
                     if actual_batch:
                         data['batch'] = actual_batch.id
                except Exception:
                    pass

            serializer = self.get_serializer(PartyMasterInstance, data=data, partial=partial)
            serializer.is_valid(raise_exception=True)

            # Get Validate data

            party_name = serializer.validated_data.get('party_name')
            customer_supplier = serializer.validated_data.get('customer_supplier')
            enabled = serializer.validated_data.get('enabled')
            address = serializer.validated_data.get('address')
            city = serializer.validated_data.get('city')
            state = serializer.validated_data.get('state')
            country = serializer.validated_data.get('country')
            organization = serializer.validated_data.get('organization')
            batch = serializer.validated_data.get('batch')
            gst_no = serializer.validated_data.get('gst_no')
            phone = serializer.validated_data.get('phone')
            email_id = serializer.validated_data.get('email_id')
            updated_by = serializer.validated_data.get('updated_by')

            # Get Org & branch & city & state & country Instance

            try:
                OrganizationInstance = Organization.objects.get(id=organization.id, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Provided Organization Id not found'}, status=status.HTTP_200_OK)

            try:
                BatchInstance = Batch.objects.get(id=batch.id, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Provided Batch Id not found'}, status=status.HTTP_200_OK)

            CityInstance = None
            if city is not None:
                try:
                    CityInstance = City.objects.get(id=city.id, is_active=True)
                except ObjectDoesNotExist:
                    return Response({'message': 'Provided City Id not found'}, status=status.HTTP_200_OK)

            StateInstance = None
            if state is not None:
                try:
                    StateInstance = State.objects.get(id=state.id, is_active=True)
                except ObjectDoesNotExist:
                    return Response({'message': 'Provided State Id not found'}, status=status.HTTP_200_OK)

            CountryInstance = None
            if country is not None:
                try:
                    CountryInstance = Country.objects.get(id=country.id, is_active=True)
                except ObjectDoesNotExist:
                    return Response({'message': 'Provided Country Id not found'}, status=status.HTTP_200_OK)

            # Update the Record

            PartyMasterInstance.party_name = party_name

            PartyMasterInstance.customer_supplier = customer_supplier

            PartyMasterInstance.enabled = enabled

            PartyMasterInstance.address = address
            if city is not None:
                PartyMasterInstance.city = CityInstance
            if state is not None:
                PartyMasterInstance.state = StateInstance
            if country is not None:
                PartyMasterInstance.country = CountryInstance
            PartyMasterInstance.organization = OrganizationInstance
            PartyMasterInstance.batch = BatchInstance
            PartyMasterInstance.gst_no = gst_no
            PartyMasterInstance.phone = phone
            PartyMasterInstance.email_id = email_id
            PartyMasterInstance.updated_by = updated_by

            PartyMasterInstance.save()

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

            processname='PartyMasterUpdate',

            message=error_message,

        )


class PartyMasterSearchListAPIView(ListAPIView):
    serializer_class = PartyMasterSearchSerializer

    def list(self, request, *args, **kwargs):
        try:
            organization = request.query_params.get("org_id")
            batch_id = request.query_params.get("branch_id")
            party_name = request.query_params.get("party_name")
            party_type = request.query_params.get("party_type")
            gst_no = request.query_params.get("gst_no")
            address = request.query_params.get("address")
            city = request.query_params.get("city")
            state = request.query_params.get("state")
            is_active = request.query_params.get("is_active")

            if not organization:
                return Response({'message': 'Please provide org_id '}, status=status.HTTP_400_BAD_REQUEST)

            if not batch_id:
                return Response({'message': 'Please provide branch_id '}, status=status.HTTP_400_BAD_REQUEST)

            if not is_active:
                return Response({'message': 'Please provide active data '}, status=status.HTTP_400_BAD_REQUEST)

            # Correctly handle branch_id -> batch_id mapping
            if batch_id:
               try:
                   actual_batch = Batch.objects.filter(branch_id=batch_id, is_active=True).first()
                   if actual_batch:
                       batch_id = actual_batch.id
               except Exception:
                   pass

            # Convert is_active string to boolean if needed, or rely on capitalization if that's what the model expects (it seems to expect a boolean or string 'True'/'False')
            # It seems is_active in filter below uses Capitalize(), so 'true' -> 'True'. 
            # However, simpler to just filter by the mapped batch_id.
            
            # get All party list
            filterdata = PartyMaster.objects.filter(organization=organization, batch=batch_id,
                                                    is_active=is_active.capitalize())

            if filterdata:

                # if is_active:
                #     filterdata= filterdata.filter(is_active=is_active)

                if party_name:
                    filterdata = filterdata.filter(party_name__icontains=party_name)

                # if party_type:
                #     if party_type.upper() == "C":
                #         # Check if "C" exists in the database
                #         if filterdata.filter(party_type_iexact="C").exists():
                #             filterdata = filterdata.filter(Q(party_type="C") | Q(party_type="B"))
                #         else:
                #             filterdata = filterdata.filter(party_type="B")  # Only return "B" if "C" doesn't exist
                #
                #     elif party_type.upper() == "S":
                #         # Check if "S" exists in the database
                #         if filterdata.filter(party_type="S").exists():
                #             filterdata = filterdata.filter(Q(party_type="S") | Q(party_type="B"))
                #         else:
                #             filterdata = filterdata.filter(party_type="B")

                if party_type:
                    if party_type.upper() == "C":
                        filterdata = filterdata.filter(party_flag__iexact="C") | filterdata.filter(
                            party_flag__iexact="B")
                    elif party_type.upper() == "S":
                        filterdata = filterdata.filter(party_flag__iexact="S") | filterdata.filter(
                            party_flag__iexact="B")

                if gst_no:
                    filterdata = filterdata.filter(gst_no=gst_no)

                if address:
                    filterdata = filterdata.filter(address=address)

                if city:
                    filterdata = filterdata.filter(city__city_name__icontains=city)

                if state:
                    filterdata = filterdata.filter(state__state_name__icontains=state)

                # make response search Party List

                if filterdata:
                    responseData = []

                    for item in filterdata:
                        data = {
                            'party_id': item.party_id,
                            'party_name': item.party_name,
                            'party_type': "Supplier" if item.customer_supplier == "S" else "Both" if item.customer_supplier == "B" else item.customer_supplier,
                            'enabled': item.enabled,
                            'address': item.address,
                            'city': item.city.city_name if item.city else None,
                            'state': item.state.state_name if item.state else None,
                            'gst_no': item.gst_no,
                            'phone': item.phone,
                            'email_id': item.email_id,
                            'is_active': item.is_active
                        }
                        responseData.append(data)

                    return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)

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

            request=str(request)[:100],

            process_name='PartySearchList',

            message=error_message[:200],

            data='',

        )


class ExpenseNoGenerateListAPIView(ListAPIView):
    serializer_class = ExpenseHeaderSerializer

    def list(self, request, *args, **kwargs):
        try:
            # Get the maximum expense_no from the table
            # max_expense_no = ExpenseHeader.objects.aggregate(Max('expense_no'))['expense_no__max'] or 0
            max_expense_no = ExpenseHeader.objects.aggregate(Max('expense_no')).get('expense_no__max', 0) or 0

            # If no expense_no exists, start from 1
            next_expense_no = (max_expense_no + 1) if max_expense_no else 1

            return Response({"message": 'success', 'expense_no': next_expense_no}, status=status.HTTP_200_OK)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(

            request=str(request),

            processname='ExpenseNoList',

            message=error_message,

        )


class AddExpenseCreateAPIView(CreateAPIView):
    serializer_class = ExpenseAddSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)

                # Get validated data
                expense_header_data = serializer.validated_data.get('ExpenseHeaderadd')
                expense_details_list = serializer.validated_data.get('ExpenseDetails')
                cash_payment = serializer.validated_data.get('PaymentBasedOnCash')
                bank_payment = serializer.validated_data.get('PaymentBasedOnBank')

                if not cash_payment and not bank_payment:
                    return Response(
                        {'error': 'At least one payment method (Cash or Bank) must be chosen.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Fetch organization, branch, and party master instances
                try:
                    organization = Organization.objects.get(id=expense_header_data.get('org_id'), is_active=True)
                    
                    # Resolve Batch/Branch ID
                    # The frontend sends 'batch_id' which might be an AcademicYear ID, Batch ID, or Branch ID.
                    # It also sends 'branch_id'.
                    # We need to find the correct active Batch to link this expense to.
                    
                    provided_batch_id = expense_header_data.get('batch_id')
                    provided_branch_id = expense_header_data.get('branch_id')
                    
                    actual_batch = None
                    
                    # 1. Try to find if provided_batch_id is an AcademicYear
                    if provided_batch_id:
                        try:
                            ay = AcademicYear.objects.filter(id=provided_batch_id).first()
                            if ay:
                                # If it's an AY, use its batch's branch to find an active batch, or just use the ay's batch if active
                                # Ideally we want the active batch for the branch.
                                # Let's try to get the active batch for the branch associated with this AY.
                                branch_id_from_ay = ay.branch.id
                                actual_batch = Batch.objects.filter(branch_id=branch_id_from_ay, is_active=True).first()
                        except Exception:
                            pass
                            
                    # 2. If no batch found yet, try treating provided_batch_id as a Branch ID
                    if not actual_batch and provided_batch_id:
                        try:
                             actual_batch = Batch.objects.filter(branch_id=provided_batch_id, is_active=True).first()
                        except Exception:
                            pass

                    # 3. If still no batch, try treating provided_batch_id as a Batch ID
                    if not actual_batch and provided_batch_id:
                        try:
                            actual_batch = Batch.objects.filter(id=provided_batch_id, is_active=True).first()
                        except Exception:
                            pass
                            
                    # 4. Fallback to using the provided 'branch_id' field if available
                    if not actual_batch and provided_branch_id:
                        try:
                            actual_batch = Batch.objects.filter(branch_id=provided_branch_id, is_active=True).first()
                        except Exception:
                            pass

                    if not actual_batch:
                         return Response({'error': 'Batch not found for the provided IDs'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    branch = actual_batch # The model field is named 'batch' but variable was 'branch' in previous code, keeping 'branch' variable name for minimal diff though it holds a Batch instance
                    
                    party_master = PartyMaster.objects.get(party_id=expense_header_data.get('partymasterId'),
                                                           is_active=True)
                except Organization.DoesNotExist:
                    return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
                # Batch.DoesNotExist is handled by manual checks above
                except PartyMaster.DoesNotExist:
                    return Response({'error': 'Party Master not found'}, status=status.HTTP_400_BAD_REQUEST)

                # Insert expense header record
                try:
                    # Auto-generate expense_no if not provided
                    expense_no = expense_header_data.get('expense_no')
                    if not expense_no or expense_no == '':
                        max_expense_no = ExpenseHeader.objects.aggregate(Max('expense_no')).get('expense_no__max',
                                                                                                0) or 0
                        expense_no = (max_expense_no + 1) if max_expense_no else 1
                    else:
                        # Convert to int if it's a string
                        try:
                            expense_no = int(expense_no)
                        except (ValueError, TypeError):
                            max_expense_no = ExpenseHeader.objects.aggregate(Max('expense_no')).get('expense_no__max',
                                                                                                    0) or 0
                            expense_no = (max_expense_no + 1) if max_expense_no else 1

                    expense_header = ExpenseHeader.objects.create(
                        date=expense_header_data.get('date'),
                        expense_no=expense_no,
                        organization=organization,
                        batch=branch,
                        party=party_master,
                        party_reference=expense_header_data.get('party_reference'),
                        total_amount=expense_header_data.get('total_amount'),
                        paid_amount=expense_header_data.get('paid_amount'),
                        balance_amount=expense_header_data.get('balance_amount'),
                        created_by=expense_header_data.get('created_by'),
                        updated_by=expense_header_data.get('created_by')
                    )
                except Exception as e:
                    return Response({'error': f'Error creating expense header: {str(e)}'},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                # Insert expense details
                for expense_detail in expense_details_list:
                    try:
                        category = ExpenseCategoryMaster.objects.get(
                            expense_category_id=expense_detail.get('expensecategoryId'), is_active=True
                        )
                        ExpenseDetail.objects.create(
                            expense_header=expense_header,
                            expense_category=category,
                            amount=expense_detail.get('amount'),
                            remarks=expense_detail.get('remarks'),
                            created_by=expense_header_data.get('created_by'),
                            updated_by=expense_header_data.get('created_by')
                        )
                    except ExpenseCategoryMaster.DoesNotExist:
                        return Response(
                            {'message': f'Expense category ID {expense_detail.get("expensecategoryId")} not found'},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                # Insert payment details for cash
                if cash_payment:

                    # max_payment_no = ExpensePayment.objects.aggregate(Max('payment_no'))['payment_no'] or 0
                    # next_payment_no = max_payment_no + 1
                    try:
                        last_payment = ExpensePayment.objects.latest('payment_no')
                        next_payment_no = last_payment.payment_no + 1
                    except ExpensePayment.DoesNotExist:
                        next_payment_no = 1  # Start from 1 if no records exist

                    try:
                        cash_payment_instance = ExpensePayment.objects.create(
                            payment_no=next_payment_no,
                            ExpenseHeaderId=expense_header,
                            payment_method=cash_payment.get('payment_method'),
                            payment_amount=cash_payment.get('cash_amount'),
                            payment_date=expense_header_data.get('date'),
                            created_by=expense_header_data.get('created_by'),
                            updated_by=expense_header_data.get('created_by')
                        )

                        ExpensePaymentDetail.objects.create(
                            ExpensePaymentId=cash_payment_instance,
                            applied_amount=cash_payment.get('cash_amount'),
                            applied_date=expense_header_data.get('date'),
                            payment_method=cash_payment.get('payment_method'),
                            created_by=expense_header_data.get('created_by'),
                            updated_by=expense_header_data.get('created_by')
                        )
                    except Exception as e:
                        return Response({'message': f'Error  cash payment: {str(e)}'},
                                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                # Insert payment details for bank
                if bank_payment and bank_payment:
                    # max_payment_no = ExpensePayment.objects.aggregate(Max('payment_no'))['payment_no'] or 0
                    # next_payment_no = max_payment_no + 1
                    try:
                        last_payment = ExpensePayment.objects.latest('payment_no')
                        next_payment_no = last_payment.payment_no + 1
                    except ExpensePayment.DoesNotExist:
                        next_payment_no = 1  # Start from 1 if no records exist

                    try:
                        bank = Bank.objects.get(id=bank_payment.get('bankId'), is_active=True)
                        bank_account = BankAccountDetail.objects.get(id=bank_payment.get('bank_accountId'),
                                                                     is_active=True)
                    except Bank.DoesNotExist:
                        return Response({'message': 'Bank ID not found'}, status=status.HTTP_400_BAD_REQUEST)
                    except BankAccountDetail.DoesNotExist:
                        return Response({'message': 'Bank Account ID not found'}, status=status.HTTP_400_BAD_REQUEST)

                    try:
                        bank_payment_instance = ExpensePayment.objects.create(
                            payment_no=next_payment_no,
                            ExpenseHeaderId=expense_header,
                            payment_method=bank_payment.get('payment_method'),
                            payment_amount=bank_payment.get('bank_amount'),
                            payment_date=expense_header_data.get('date'),
                            created_by=expense_header_data.get('created_by'),
                            updated_by=expense_header_data.get('created_by')
                        )

                        ExpensePaymentDetail.objects.create(
                            ExpensePaymentId=bank_payment_instance,
                            applied_amount=bank_payment.get('bank_amount'),
                            applied_date=expense_header_data.get('date'),
                            payment_method=bank_payment.get('payment_method'),
                            bankId=bank,
                            bank_accountId=bank_account,
                            created_by=expense_header_data.get('created_by'),
                            updated_by=expense_header_data.get('created_by')
                        )
                    except Exception as e:
                        return Response({'message': f'Error inserting bank payment: {str(e)}'},
                                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                return Response({'message': 'success'}, status=status.HTTP_200_OK)

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

            processname='ExpenseAdd',

            message=error_message,

        )


class ExpenseIncomeListBasedOnCategory(ListAPIView):
    serializer_class = ExpenseIncomeCategoryList

    def list(self, request, *args, **kwargs):
        try:
            # Get query parameters
            organization_id = request.query_params.get('organization_id')
            batch_id = request.query_params.get('batch_id')
            flag = request.query_params.get('flag')

            # Validate required parameters
            if not organization_id:
                return Response({'message': 'Please provide organization_id'}, status=status.HTTP_400_BAD_REQUEST)
            if not batch_id:
                return Response({'message': 'Please provide batch_id'}, status=status.HTTP_400_BAD_REQUEST)
            if not flag:
                return Response({'message': 'Please provide flag'}, status=status.HTTP_400_BAD_REQUEST)

            # Collect possible batch IDs (treat input as Batch ID, Branch ID, or AcademicYear ID)
            possible_batches = {batch_id} # Use a set to avoid duplicates

            if batch_id:
                try:
                    # 1. Treat as AcademicYear ID
                    # Check if it matches an AcademicYear first (since frontend sends academicSessionId)
                    ay = AcademicYear.objects.filter(id=batch_id).first()
                    if ay:
                        # If it's an AcademicYear, getting all batches for its branch seems safest to ensure visibility
                        # consistent with how we handled the Branch ID case.
                        # Using the branch from the academic year's batch or direct relation if exists (model has branch FK)
                        branch_id_from_ay = ay.branch.id 
                        branch_batches = Batch.objects.filter(branch_id=branch_id_from_ay, is_active=True).values_list('id', flat=True)
                        possible_batches.update(branch_batches)
                    
                    # 2. Treat as Branch ID: get all active batches for this branch
                    branch_batches = Batch.objects.filter(branch_id=batch_id, is_active=True).values_list('id', flat=True)
                    possible_batches.update(branch_batches)
                    
                    # 3. Treat as Batch ID (already in possible_batches)
                    # If it matches a Batch directly, it's there.
                except Exception:
                    pass

            # Initial filter with organization_id and valid batch IDs
            categoryList = ExpenseCategoryMaster.objects.filter(
                organization_id=organization_id,
                batch_id__in=possible_batches,
                is_active=True
            )

            # Apply flag-based filtering
            if flag == 'E':
                # Expense: Include both 'E' and 'B' (Both) categories
                categoryList = categoryList.filter(Q(category_type__iexact=flag) | Q(category_type__iexact='B'))
            elif flag == 'B':
                # Both: Only 'B' categories
                categoryList = categoryList.filter(category_type__iexact=flag)
            elif flag == 'I':
                # Income: Include both 'I' and 'B' (Both) categories
                categoryList = categoryList.filter(Q(category_type__iexact=flag) | Q(category_type__iexact='B'))

            if categoryList.exists():
                responseData = []
                for item in categoryList:
                    data = {
                        "expense_category_id": item.expense_category_id,
                        "expense_category": item.expense_category,
                        "organization": item.organization.id,
                        "organizationName": item.organization.organization_code,
                        "batch_id": item.batch.id,
                        "batch_name": item.batch.batch_code,
                        "enabled": item.enabled,
                        "category_type": "EXPENSE" if item.category_type.upper() == "E" else "INCOME" if item.category_type.upper() == "I" else item.category_type,
                        "category_flag": item.category_flag
                    }

                    responseData.append(data)

                return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)

            else:
                return Response({'message': 'No Record Found'}, status=status.HTTP_200_OK)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request)[:100],

            process_name='ExpenseIncomeBasedOnCategoryList',

            message=error_message[:200],

            data='',

        )


class ExpenseSearchListAPIView(ListAPIView):
    serializer_class = ExpenseSearchSerializer

    def list(self, request, *args, **kwargs):
        try:
            organization_id = request.query_params.get('organization_id')
            batch_id = request.query_params.get('batch_id')
            party_id = request.query_params.get('party_id')
            from_date = request.query_params.get('from_date')
            to_date = request.query_params.get('to_date')
            ExpenseCategoryId = request.query_params.get('ExpenseCategoryId')
            PartyReference = request.query_params.get('PartyReference')

            if not organization_id and not batch_id:
                return Response({'message': 'Please provide organization_id and batch_id'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Resolve Batch/Branch ID for filtering
            possible_batches = {batch_id}
            if batch_id:
                try:
                    # 1. Treat as AcademicYear ID
                    ay = AcademicYear.objects.filter(id=batch_id).first()
                    if ay:
                         possible_batches.add(ay.batch.id)
                         # Also active batch for the branch
                         branch_id_from_ay = ay.branch.id
                         branch_batches = Batch.objects.filter(branch_id=branch_id_from_ay, is_active=True).values_list('id', flat=True)
                         possible_batches.update(branch_batches)
                    
                    # 2. Treat as Branch ID
                    branch_batches = Batch.objects.filter(branch_id=batch_id, is_active=True).values_list('id', flat=True)
                    possible_batches.update(branch_batches)
                    
                    # 3. Treat as Batch ID (already added)
                except Exception:
                    pass

            try:
                # Filter by organization and the resolved set of batch IDs
                filterdata = ExpenseHeader.objects.filter(
                    organization=organization_id, 
                    batch__in=possible_batches, 
                    is_active=True
                )
            except Exception: # Handling potential errors broadly as in original code snippet logic, though specific exceptions preferred
                filterdata = None

            if filterdata:
                if party_id:
                    filterdata = filterdata.filter(party=party_id)

                if from_date:
                    filterdata = filterdata.filter(date__gte=from_date)
                if to_date:
                    filterdata = filterdata.filter(date__lte=to_date)

                if ExpenseCategoryId:
                    # Filter ExpenseHeader only if an ExpenseDetail with the given ExpenseCategoryId exists
                    filterdata = filterdata.filter(
                        Exists(
                            ExpenseDetail.objects.filter(
                                expense_header=OuterRef('pk'),
                                expense_category_id=ExpenseCategoryId,
                                is_active=True
                            )
                        )
                    )
                if PartyReference:
                    filterdata = filterdata.filter(party_reference__icontains=PartyReference)

                # check filter data exist or not

                if filterdata:
                    responseData = []
                    for item in filterdata:
                        # ExpensePayment Get associate Record
                        try:
                            ExpensePaymentList = ExpensePayment.objects.filter(ExpenseHeaderId=item.expense_header_id,
                                                                               is_active=True)
                        except:
                            ExpensePaymentList = None

                        # make empty paymentMethods variable
                        paymentMethods = set()
                        if ExpensePaymentList:
                            for record in ExpensePaymentList:
                                if record.payment_method not in paymentMethods:
                                    paymentMethods.add(record.payment_method)

                        data = {
                            'expense_header_id': item.expense_header_id,
                            'expense_no': item.expense_no,
                            'date': item.date,
                            'party_name': item.party.party_name,
                            'party_reference': item.party_reference,
                            'total_amount': item.total_amount,
                            'paid_amount': item.paid_amount,
                            'balance_amount': item.balance_amount,
                            'payment_method': paymentMethods

                        }
                        responseData.append(data)

                    return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)


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

            request=str(request)[:100],

            process_name='ExpenseSearchList',

            message=error_message[:200],

            data='',

        )


class ExpenseRetriveListAPIView(RetrieveAPIView):
    serializer_class = ExpenseAddSerializer

    def retrieve(self, request, *args, **kwargs):
        try:
            ExpenseHeaderId = self.kwargs.get('pk')

            try:
                ExpenseHeaderInstance = ExpenseHeader.objects.get(expense_header_id=ExpenseHeaderId, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Provided Id Not Found'}, status=status.HTTP_404_NOT_FOUND)

            try:
                ExpenseDetailList = ExpenseDetail.objects.filter(expense_header=ExpenseHeaderId, is_active=True)
            except:
                ExpenseDetailList = None

            try:
                ExpensePaymentList = ExpensePayment.objects.filter(ExpenseHeaderId=ExpenseHeaderId, is_active=True)
            except:
                ExpensePaymentList = None

            ExpensePaymentrecord = []

            for record in ExpensePaymentList:

                # Get Details on ExpensePaymentDetail DB
                try:
                    ExpensePaymentDetailInstance = ExpensePaymentDetail.objects.get(
                        ExpensePaymentId=record.payment_id, is_active=True)
                except ObjectDoesNotExist:
                    ExpensePaymentDetailInstance = None

                if ExpensePaymentDetailInstance is not None:
                    data = {
                        'payment_detail_id': ExpensePaymentDetailInstance.payment_detail_id,
                        'ExpensePaymentId': ExpensePaymentDetailInstance.ExpensePaymentId.payment_id,
                        'applied_amount': ExpensePaymentDetailInstance.applied_amount,
                        'applied_date': ExpensePaymentDetailInstance.applied_date,
                        'payment_method': ExpensePaymentDetailInstance.payment_method,
                        'bankId': ExpensePaymentDetailInstance.bankId.id if ExpensePaymentDetailInstance.bankId else None,
                        'bank_name': ExpensePaymentDetailInstance.bankId.bank_name if ExpensePaymentDetailInstance.bankId else None,
                        'bank_accountId': ExpensePaymentDetailInstance.bank_accountId.id if ExpensePaymentDetailInstance.bank_accountId else None,
                        'bank_account': ExpensePaymentDetailInstance.bank_accountId.bank_account if ExpensePaymentDetailInstance.bank_accountId else None
                    }

                    ExpensePaymentrecord.append(data)

                # if ExpensePaymentDetailInstance:
                #     for paymentdetail in ExpensePaymentDetailInstance:
                #

            ExpenseDetailsrecord = []
            if ExpenseDetailList:

                for record in ExpenseDetailList:
                    data = {
                        'expense_detail_id': record.expense_detail_id,
                        'expense_categoryId': record.expense_category.expense_category_id,
                        'expense_category_name': record.expense_category.expense_category,
                        'amount': record.amount,
                        'remarks': record.remarks

                    }
                    ExpenseDetailsrecord.append(data)

            # Make Final Response

            responseData = {
                'expense_header_id': ExpenseHeaderInstance.expense_header_id,
                'party_id': ExpenseHeaderInstance.party.party_id,
                'party_name': ExpenseHeaderInstance.party.party_name,
                'date': ExpenseHeaderInstance.date,
                'expense_no': ExpenseHeaderInstance.expense_no,
                'party_reference': ExpenseHeaderInstance.party_reference,
                'total_amount': ExpenseHeaderInstance.total_amount,
                'paid_amount': ExpenseHeaderInstance.paid_amount,
                'balance_amount': ExpenseHeaderInstance.balance_amount,
                'ExpenseDetailsdata': ExpenseDetailsrecord,
                'PaymentDetailsData': ExpensePaymentrecord

            }

            return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)

        except Http404:

            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)


        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request)[:100],

            process_name='ExpansedetialsRetrieve',

            message=error_message[:200],

            data='',

        )


class ExpenseUpdateAPIView(UpdateAPIView):
    queryset = ExpenseHeader.objects.all()
    serializer_class = ExpenseUpdateSerializer

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            ExpenseInstance = self.get_object()

            # Get the input data
            ExpenseHeaderadd = request.data.get('ExpenseHeaderadd', {})
            ExpenseDetails = request.data.get('ExpenseDetails', [])
            PaymentBasedOnCash = request.data.get('PaymentBasedOnCash', {})
            PaymentBasedOnBank = request.data.get('PaymentBasedOnBank', {})

            if not ExpenseHeaderadd:
                return Response({'message': 'ExpenseHeaderadd record details Not Found'},
                                status=status.HTTP_400_BAD_REQUEST)

            if not ExpenseDetails:
                return Response({'message': 'ExpenseDetails record details Not Found'},
                                status=status.HTTP_400_BAD_REQUEST)

            if not PaymentBasedOnCash and not PaymentBasedOnBank:
                return Response({'message': 'Please choose a payment method'}, status=status.HTTP_400_BAD_REQUEST)

            # Updating the ExpenseHeader instance
            if ExpenseHeaderadd:
                try:
                    OrganizationInstance = Organization.objects.get(id=ExpenseHeaderadd.get('organization_id'),
                                                                    is_active=True)
                    # Resolve Batch ID (Logic copied from Create view to handle ambiguity)
                    provided_batch_id = ExpenseHeaderadd.get('batch_id')
                    BatchInstance = None
                    
                    if provided_batch_id:
                        # 1. Try as AcademicYear
                        try:
                            ay = AcademicYear.objects.filter(id=provided_batch_id).first()
                            if ay:
                                branch_id_from_ay = ay.branch.id
                                BatchInstance = Batch.objects.filter(branch_id=branch_id_from_ay, is_active=True).first()
                        except Exception:
                            pass
                            
                        # 2. Try as Branch ID
                        if not BatchInstance:
                             try:
                                  BatchInstance = Batch.objects.filter(branch_id=provided_batch_id, is_active=True).first()
                             except Exception:
                                pass
                                
                        # 3. Try as Batch ID
                        if not BatchInstance:
                            try:
                                BatchInstance = Batch.objects.filter(id=provided_batch_id, is_active=True).first()
                            except Exception:
                                pass

                    if not BatchInstance:
                        raise Batch.DoesNotExist("Batch matching query does not exist.")
                    partyInstance = PartyMaster.objects.get(party_id=ExpenseHeaderadd.get('partymasterId'),
                                                            is_active=True)
                except ObjectDoesNotExist as e:
                    transaction.set_rollback(True)  # Explicitly set the rollback flag
                    return Response({'message': f'Invalid {str(e).split(" ")[-1]} Id'},
                                    status=status.HTTP_400_BAD_REQUEST)

                # Update the ExpenseHeader instance
                ExpenseInstance.organization = OrganizationInstance
                ExpenseInstance.batch = BatchInstance
                ExpenseInstance.party = partyInstance
                ExpenseInstance.expense_no = ExpenseHeaderadd.get('expense_no')
                ExpenseInstance.date = ExpenseHeaderadd.get('date')
                ExpenseInstance.party_reference = ExpenseHeaderadd.get('party_reference')
                ExpenseInstance.total_amount = ExpenseHeaderadd.get('total_amount')
                ExpenseInstance.paid_amount = ExpenseHeaderadd.get('paid_amount')
                ExpenseInstance.balance_amount = ExpenseHeaderadd.get('balance_amount')
                ExpenseInstance.updated_by = ExpenseHeaderadd.get('updated_by')
                ExpenseInstance.save()

            # Process ExpenseDetails
            if ExpenseDetails:
                for item in ExpenseDetails:
                    expense_detail_id = item.get('expense_detail_id')
                    if expense_detail_id == 0 or expense_detail_id is None:
                        try:
                            categoryInstance = ExpenseCategoryMaster.objects.get(
                                expense_category_id=item.get('expensecategoryId'), is_active=True)
                        except ObjectDoesNotExist:
                            return Response({'message': 'Please provide a valid category ID'},
                                            status=status.HTTP_400_BAD_REQUEST)

                        # Create ExpenseDetail record
                        ExpenseDetail.objects.create(
                            expense_header=ExpenseInstance,
                            expense_category=categoryInstance,
                            amount=item.get('amount'),
                            remarks=item.get('remarks'),
                            created_by=ExpenseHeaderadd.get('updated_by'),
                            updated_by=ExpenseHeaderadd.get('updated_by')
                        )
                    else:
                        try:
                            ExpenseDetailsInstance = ExpenseDetail.objects.get(expense_detail_id=expense_detail_id,
                                                                               is_active=True)
                            ExpenseCategoryInstance = ExpenseCategoryMaster.objects.get(
                                expense_category_id=item.get('expensecategoryId'), is_active=True)
                        except ObjectDoesNotExist:
                            transaction.set_rollback(True)  # Rollback for invalid record
                            return Response({'message': 'Invalid ExpenseDetail or Category'},
                                            status=status.HTTP_400_BAD_REQUEST)

                        # Update ExpenseDetail
                        ExpenseDetailsInstance.expense_category = ExpenseCategoryInstance
                        ExpenseDetailsInstance.expense_header = ExpenseInstance
                        ExpenseDetailsInstance.amount = item.get('amount')
                        ExpenseDetailsInstance.remarks = item.get('remarks')
                        ExpenseDetailsInstance.updated_by = ExpenseHeaderadd.get('updated_by')
                        ExpenseDetailsInstance.save()

            # Check if we're creating a new payment (switching methods) or updating existing
            is_creating_new_payment = (
                    (PaymentBasedOnCash and (PaymentBasedOnCash.get('payment_detail_id') == 0 or PaymentBasedOnCash.get(
                        'payment_detail_id') is None)) or
                    (PaymentBasedOnBank and (PaymentBasedOnBank.get('payment_detail_id') == 0 or PaymentBasedOnBank.get(
                        'payment_detail_id') is None))
            )

            # Collect payment_detail_ids that are being updated (to preserve them)
            payment_detail_ids_to_preserve = set()
            if PaymentBasedOnCash and PaymentBasedOnCash.get('payment_detail_id') and PaymentBasedOnCash.get(
                    'payment_detail_id') > 0:
                payment_detail_ids_to_preserve.add(PaymentBasedOnCash.get('payment_detail_id'))
            if PaymentBasedOnBank and PaymentBasedOnBank.get('payment_detail_id') and PaymentBasedOnBank.get(
                    'payment_detail_id') > 0:
                payment_detail_ids_to_preserve.add(PaymentBasedOnBank.get('payment_detail_id'))

            # When creating a new payment (switching methods), deactivate all existing payments
            # When updating existing payment, only deactivate others
            existing_payments = ExpensePayment.objects.filter(
                ExpenseHeaderId=ExpenseInstance,
                is_active=True
            )

            for existing_payment in existing_payments:
                # Get all payment details for this payment
                payment_details = ExpensePaymentDetail.objects.filter(
                    ExpensePaymentId=existing_payment.payment_id,
                    is_active=True
                )

                # Deactivate payment details that are NOT being updated
                # If creating new payment, deactivate all. If updating, preserve the one being updated.
                for payment_detail in payment_details:
                    if is_creating_new_payment or payment_detail.payment_detail_id not in payment_detail_ids_to_preserve:
                        payment_detail.is_active = False
                        payment_detail.updated_by = ExpenseHeaderadd.get('updated_by')
                        payment_detail.save()

                # If all payment details are deactivated, deactivate the payment too
                if not ExpensePaymentDetail.objects.filter(
                        ExpensePaymentId=existing_payment.payment_id,
                        is_active=True
                ).exists():
                    existing_payment.is_active = False
                    existing_payment.updated_by = ExpenseHeaderadd.get('updated_by')
                    existing_payment.save()

            # ExpensePaymentInstance = ExpensePayment.objects.get()
            # Handle PaymentBasedOnCash
            if PaymentBasedOnCash:
                if PaymentBasedOnCash.get('payment_detail_id') == 0 or PaymentBasedOnCash.get(
                        'payment_detail_id') is None:
                    try:
                        last_payment = ExpensePayment.objects.latest('payment_no')
                        next_payment_no = last_payment.payment_no + 1
                    except ExpensePayment.DoesNotExist:
                        next_payment_no = 1  # Start from 1 if no records exist

                    # Create Payment ExpensePayment
                    ExpensePaymentInstance = ExpensePayment.objects.create(
                        payment_no=next_payment_no,
                        ExpenseHeaderId=ExpenseInstance,
                        payment_method=PaymentBasedOnCash.get('payment_method'),
                        payment_amount=PaymentBasedOnCash.get('cash_amount'),
                        payment_reference="",
                        payment_date=ExpenseInstance.date,
                        created_by=ExpenseHeaderadd.get('updated_by'),
                        updated_by=ExpenseHeaderadd.get('updated_by')
                    )

                    # Enter data into ExpensePaymentDetail
                    ExpensePaymentDetail.objects.create(
                        ExpensePaymentId=ExpensePaymentInstance,
                        applied_amount=PaymentBasedOnCash.get('cash_amount'),
                        applied_date=ExpenseHeaderadd.get('date'),
                        payment_method=PaymentBasedOnCash.get('payment_method'),
                        created_by=ExpenseHeaderadd.get('updated_by'),
                        updated_by=ExpenseHeaderadd.get('updated_by')
                    )
                else:
                    # Update existing record in ExpensePaymentDetail
                    try:
                        ExpensePaymentDetailInstance = ExpensePaymentDetail.objects.get(
                            payment_detail_id=PaymentBasedOnCash.get('payment_detail_id'), is_active=True)
                    except ObjectDoesNotExist:
                        return Response({'message': 'Invalid ExpensePayment details'}, status=status.HTTP_404_NOT_FOUND)

                    # Update the record
                    ExpensePaymentDetailInstance.payment_method = PaymentBasedOnCash.get('payment_method')
                    ExpensePaymentDetailInstance.applied_amount = PaymentBasedOnCash.get('cash_amount')
                    ExpensePaymentDetailInstance.updated_by = ExpenseHeaderadd.get('updated_by')
                    ExpensePaymentDetailInstance.save()

            # Handle PaymentBasedOnBank (similar approach)
            if PaymentBasedOnBank:
                try:
                    bankInstance = Bank.objects.get(id=PaymentBasedOnBank.get('bankId'), is_active=True)
                    AccountInstance = BankAccountDetail.objects.get(id=PaymentBasedOnBank.get('bank_accountId'),
                                                                    is_active=True)
                except ObjectDoesNotExist:
                    return Response({'message': 'No bank or account record found'}, status=status.HTTP_404_NOT_FOUND)

                if PaymentBasedOnBank.get('payment_detail_id') == 0 or PaymentBasedOnBank.get(
                        'payment_detail_id') is None:
                    try:
                        last_payment = ExpensePayment.objects.latest('payment_no')
                        next_payment_no = last_payment.payment_no + 1
                    except ExpensePayment.DoesNotExist:
                        next_payment_no = 1

                    # Create PaymentExpense
                    ExpensePaymentInstance = ExpensePayment.objects.create(
                        payment_no=next_payment_no,
                        ExpenseHeaderId=ExpenseInstance,
                        payment_method=PaymentBasedOnBank.get('payment_method'),
                        payment_amount=PaymentBasedOnBank.get('bank_amount'),
                        payment_reference="",
                        payment_date=ExpenseInstance.date,
                        created_by=ExpenseHeaderadd.get('updated_by'),
                        updated_by=ExpenseHeaderadd.get('updated_by')
                    )

                    # Enter data into ExpensePaymentDetail
                    ExpensePaymentDetail.objects.create(
                        ExpensePaymentId=ExpensePaymentInstance,
                        applied_amount=PaymentBasedOnBank.get('bank_amount'),
                        applied_date=ExpenseHeaderadd.get('date'),
                        payment_method=PaymentBasedOnBank.get('payment_method'),
                        bankId=bankInstance,
                        bank_accountId=AccountInstance,
                        created_by=ExpenseHeaderadd.get('updated_by'),
                        updated_by=ExpenseHeaderadd.get('updated_by')
                    )
                else:
                    # Update ExpensePaymentDetail
                    try:
                        ExpensePaymentDetailInstance = ExpensePaymentDetail.objects.get(
                            payment_detail_id=PaymentBasedOnBank.get('payment_detail_id'), is_active=True)
                    except ObjectDoesNotExist:
                        return Response({'message': 'Invalid ExpensePayment details'}, status=status.HTTP_404_NOT_FOUND)

                    ExpensePaymentDetailInstance.payment_method = PaymentBasedOnBank.get('payment_method')
                    ExpensePaymentDetailInstance.applied_amount = PaymentBasedOnBank.get('bank_amount')
                    ExpensePaymentDetailInstance.bankId = bankInstance
                    ExpensePaymentDetailInstance.bank_accountId = AccountInstance
                    ExpensePaymentDetailInstance.updated_by = ExpenseHeaderadd.get('updated_by')
                    ExpensePaymentDetailInstance.save()

            return Response({'message': 'success'}, status=status.HTTP_200_OK)

        except Exception as e:
            self.log_exception(request, str(e))
            return Response({'error': f'Unexpected error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            processname='ExpenseUpdate',
            message=error_message,
        )


# class ExpenseUpdateAPIView(UpdateAPIView):
#     queryset = ExpenseHeader.objects.all()
#     serializer_class = ExpenseUpdateSerializer
#
#
#     @transaction.atomic
#     def update(self, request, *args, **kwargs):
#
#         try:
#             partial = kwargs.pop('partial', False)
#             ExpenseInstance = self.get_object()
#
#             # Get the input data
#             ExpenseHeaderadd = request.data.get('ExpenseHeaderadd', {})
#             ExpenseDetails = request.data.get('ExpenseDetails', [])
#             PaymentBasedOnCash = request.data.get('PaymentBasedOnCash', {})
#             PaymentBasedOnBank = request.data.get('PaymentBasedOnBank', {})
#
#             if not ExpenseHeaderadd:
#                 return Response({'message': 'ExpenseHeaderadd record details Not Found'}, status=status.HTTP_400_BAD_REQUEST)
#
#             if not ExpenseDetails:
#                 return Response({'message': 'ExpenseDetails record details Not Found'}, status=status.HTTP_400_BAD_REQUEST)
#
#             if not PaymentBasedOnCash and not PaymentBasedOnBank:
#                 return Response({'message': 'Please choose a payment method'}, status=status.HTTP_400_BAD_REQUEST)
#
#             if ExpenseHeaderadd:
#
#                 try:
#                     OrganizationInstance = Organization.objects.get(id=ExpenseHeaderadd.get('org_id'),
#                                                                     is_active=True)
#                     BatchInstance = Batch.objects.get(id=ExpenseHeaderadd.get('batch_id'), is_active=True)
#                     # academicYearInstance = Academic_Session_Year.objects.get(
#                     #     id=IncomeHeaderDetails.get('academic_year_id'), is_active=True)
#                     partyInstance = PartyMaster.objects.get(party_id=ExpenseHeaderadd.get('partymasterId'),
#                                                             is_active=True)
#                 except ObjectDoesNotExist as e:
#                     transaction.set_rollback(True)  # Explicitly set the rollback flag
#                     return Response({'message': f'Please provideed valid {str(e).split(" ")[-1]} Id'},
#                                     status=status.HTTP_400_BAD_REQUEST)
#
#                 # Update the Income Header Record
#                 ExpenseInstance.org_id = OrganizationInstance
#                 ExpenseInstance.batch_id = BatchInstance
#                 ExpenseInstance.party_id = partyInstance
#                 ExpenseInstance.expense_no = ExpenseHeaderadd.get('expense_no')
#                 ExpenseInstance.date = ExpenseHeaderadd.get('date')
#                 ExpenseInstance.party_reference = ExpenseHeaderadd.get('party_reference')
#                 ExpenseInstance.total_amount = ExpenseHeaderadd.get('total_amount')
#                 ExpenseInstance.paid_amount = ExpenseHeaderadd.get('paid_amount')
#                 ExpenseInstance.balance_amount = ExpenseHeaderadd.get('balance_amount')
#                 ExpenseInstance.updated_by = ExpenseHeaderadd.get('updated_by')
#                 ExpenseInstance.save()
#
#             if ExpenseDetails:
#                 for item in ExpenseDetails:
#                     expense_detail_id = item.get('expense_detail_id')
#
#
#                     if expense_detail_id == 0 or expense_detail_id is None:
#                         try:
#                             categoryInstance = ExpenseCategoryMaster.objects.get(
#                                 expense_category_id=item.get('expensecategoryId'), is_active=True)
#                         except ObjectDoesNotExist:
#                             #transaction.set_rollback(True)  # Rollback for invalid category
#                             return Response({'message': 'Please provide a valid category ID'},
#                                             status=status.HTTP_400_BAD_REQUEST)
#
#                         # Create the record correctly
#                         ExpenseDetail.objects.create(
#                             expense_header=ExpenseInstance,
#                             expense_category=categoryInstance,
#                             amount=item.get('amount'),
#                             remarks=item.get('remarks'),
#                             created_by = ExpenseHeaderadd.get('updated_by'),
#                             updated_by = ExpenseHeaderadd.get('updated_by')
#                         )
#                     else:
#
#                         try:
#                             ExpenseDetailsInstance = ExpenseDetail.objects.get(expense_detail_id=expense_detail_id,
#                                                                                       is_active=True)
#                             ExpenseCategoryInstance = ExpenseCategoryMaster.objects.get(
#                                 expense_category_id=item.get('expensecategoryId'), is_active=True)
#                         except ObjectDoesNotExist:
#                             transaction.set_rollback(True)  # Rollback for invalid income details or category
#                             return Response({'message': 'Please Provide Valid Income Details or Categoryss'},
#                                             status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#                         ExpenseDetailsInstance.expense_category = ExpenseCategoryInstance
#                         ExpenseDetailsInstance.expense_header = ExpenseInstance
#                         ExpenseDetailsInstance.amount = item.get('amount')
#                         ExpenseDetailsInstance.remarks = item.get('remarks')
#                         ExpenseDetailsInstance.updated_by = ExpenseHeaderadd.get('updated_by')
#                         ExpenseDetailsInstance.save()
#
#             if PaymentBasedOnCash:
#                 if PaymentBasedOnCash.get('payment_detail_id') == 0 or PaymentBasedOnCash.get('payment_detail_id') == None:
#
#                     try:
#                         last_payment = ExpensePayment.objects.latest('payment_no')
#                         next_payment_no = last_payment.payment_no + 1
#                     except ExpensePayment.DoesNotExist:
#                         next_payment_no = 1  # Start from 1 if no records exist
#
#                     # create Payment ExpensePayment
#
#                     ExpensePaymentInstance = ExpensePayment.objects.create(
#                         payment_no=next_payment_no,
#                         ExpenseHeaderId= ExpenseInstance,
#                         payment_method =PaymentBasedOnCash.get('payment_method'),
#                         payment_amount = PaymentBasedOnCash.get('cash_amount'),
#                         payment_reference ="",
#                         payment_date = ExpenseInstance.date,
#                         created_by=ExpenseHeaderadd.get('updated_by'),
#                         updated_by = ExpenseHeaderadd.get('updated_by')
#                     )
#
#                     # Enter data into ExpensePaymentDetail
#
#                     ExpensePaymentDetailInstance = ExpensePaymentDetail.objects.create(
#                         ExpensePaymentId=ExpensePaymentInstance,
#                         applied_amount = PaymentBasedOnCash.get('cash_amount'),
#                         applied_date = ExpenseHeaderadd.get('date'),
#                         payment_method = PaymentBasedOnCash.get('payment_method'),
#                         created_by = ExpenseHeaderadd.get('updated_by'),
#                         updated_by = ExpenseHeaderadd.get('updated_by')
#                     )
#                 else:
#                     # retrive record into ExpensePaymentDetail
#                     try:
#                         ExpensePaymentDetailInstance = ExpensePaymentDetail.objects.get(payment_detail_id=PaymentBasedOnCash.get('payment_detail_id'),is_active=True)
#                     except ObjectDoesNotExist:
#                         return Response({'message': 'Please Provide Valid ExpensePayment details'},status=status.HTTP_404_NOT_FOUND)
#
#                     # update the record
#                     ExpensePaymentDetailInstance.payment_method=PaymentBasedOnCash.get('payment_method')
#                     ExpensePaymentDetailInstance.applied_amount = PaymentBasedOnCash.get('cash_amount')
#                     ExpensePaymentDetailInstance.updated_by = ExpenseHeaderadd.get('updated_by')
#                     ExpensePaymentDetailInstance.save()
#             if PaymentBasedOnBank:
#                 try:
#                     bankInstance = Bank.objects.get(id=PaymentBasedOnBank.get('bankId'),is_active=True)
#                 except:
#                     return Response({'message':'No Bank Record Found'},status=status.HTTP_404_NOT_FOUND)
#                 try:
#                     AccountInstance = BankAccountDetail.objects.get(id=PaymentBasedOnBank.get('bank_accountId'),is_active=True)
#                 except:
#                     return Response({'message':'No Account_Details Record Found'},status=status.HTTP_404_NOT_FOUND)
#
#                 if PaymentBasedOnBank.get('payment_detail_id') == 0 or PaymentBasedOnBank.get('payment_detail_id') == None:
#
#                     try:
#                         last_payment = ExpensePayment.objects.latest('payment_no')
#                         next_payment_no = last_payment.payment_no + 1
#                     except ExpensePayment.DoesNotExist:
#                         next_payment_no = 1  # Start from 1 if no records exist
#
#                     # create Payment ExpensePayment
#
#                     ExpensePaymentInstance = ExpensePayment.objects.create(
#                         payment_no=next_payment_no,
#                         ExpenseHeaderId=ExpenseInstance,
#                         payment_method=PaymentBasedOnBank.get('payment_method'),
#                         payment_amount=PaymentBasedOnBank.get('bank_amount'),
#                         payment_reference="",
#                         payment_date=ExpenseInstance.date,
#                         created_by=ExpenseHeaderadd.get('updated_by'),
#                         updated_by=ExpenseHeaderadd.get('updated_by')
#                     )
#
#                     # Enter data into ExpensePaymentDetail
#
#                     ExpensePaymentDetailInstance = ExpensePaymentDetail.objects.create(
#                         ExpensePaymentId=ExpensePaymentInstance,
#                         applied_amount=PaymentBasedOnBank.get('bank_amount'),
#                         applied_date=ExpenseHeaderadd.get('date'),
#                         payment_method=PaymentBasedOnBank.get('payment_method'),
#                         bankId = bankInstance,
#                         bank_accountId= AccountInstance,
#                         created_by=ExpenseHeaderadd.get('updated_by'),
#                         updated_by=ExpenseHeaderadd.get('updated_by')
#                     )
#                 else:
#                     # retrive record into ExpensePaymentDetail
#                     try:
#                         ExpensePaymentDetailInstance = ExpensePaymentDetail.objects.get(
#                             payment_detail_id=PaymentBasedOnCash.get('payment_detail_id'), is_active=True)
#                     except ObjectDoesNotExist:
#                         return Response({'message': 'Please Provide Valid ExpensePayment details'},
#                                         status=status.HTTP_404_NOT_FOUND)
#
#                     # update the record
#                     ExpensePaymentDetailInstance.payment_method = PaymentBasedOnBank.get('payment_method')
#                     ExpensePaymentDetailInstance.applied_amount = PaymentBasedOnBank.get('bank_amount')
#                     ExpensePaymentDetailInstance.bankId= bankInstance
#                     ExpensePaymentDetailInstance.bank_accountId = AccountInstance
#                     ExpensePaymentDetailInstance.updated_by = ExpenseHeaderadd.get('updated_by'),
#
#                     ExpensePaymentDetailInstance.save()
#
#             return Response({'message':'success'},status=status.HTTP_200_OK)
#
#
#
#         except Http404:
#
#             return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)
#
#
#         except ValidationError as e:
#
#             return Response({'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)
#
#
#         except DatabaseError as e:
#
#             self.log_exception(request, str(e))
#
#             # transaction.set_rollback(True)  # Rollback for database error
#
#             return Response({'error': 'A database error occurred.' + str(e)},
#
#                             status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#
#         except Exception as e:
#
#             self.log_exception(request, str(e))
#
#             # transaction.set_rollback(True)  # Rollback for unexpected errors
#
#             return Response({'error': 'An unexpected error occurred.' + str(e)},
#
#                             status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#
#     def log_exception(self, request, error_message):
#
#         ExceptionTrack.objects.create(
#
#             request=str(request),
#
#             processname='ExpenseUpdate',
#
#             message=error_message,
#
#         )


class ProfitLoseByDayListAPIView(ListAPIView):
    serializer_class = ProfitLossSerializer

    def list(self, request, *args, **kwargs):
        try:
            organization = request.query_params.get('organization_id')
            batch_id = request.query_params.get('batch_id')
            from_date = request.query_params.get('from_date')
            to_date = request.query_params.get('date')

            # convert date & from_date in date format
            # from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
            # to_date = datetime.strptime(date, "%Y-%m-%d").date()

            # Ensure required parameters are provided
            if not organization or not batch_id or not from_date or not to_date:
                return Response({"error": "organization, branch_id, from_date and date are required."},
                                status=status.HTTP_400_BAD_REQUEST)

             # Correctly handle branch_id -> batch_id mapping
            if batch_id:
               try:
                   actual_batch = Batch.objects.filter(branch_id=batch_id, is_active=True).first()
                   if actual_batch:
                       batch_id = actual_batch.id
               except Exception:
                   pass

            # Get Expense Record for particular date

            try:
                # Get expense records grouped by category
                ExpensePaymentRecords = (
                    ExpenseDetail.objects.filter(
                        expense_header__organization=organization,
                        expense_header__batch=batch_id,
                        expense_header__date__gte=from_date,
                        expense_header__date__lte=to_date,
                        is_active=True
                    )
                    .values("expense_category")
                    .annotate(total_amount=Sum("amount"))
                )


            except Exception as e:
                ExpensePaymentRecords = []

            ExpenseDetailsList = []
            if ExpensePaymentRecords:
                for record in ExpensePaymentRecords:
                    # Get Expense Category Instance
                    ExpenseCategoryInstance = ExpenseCategoryMaster.objects.get(
                        expense_category_id=record.get('expense_category'))

                    # Set Response Record

                    data = {
                        # 'category_id':ExpenseCategoryInstance.expense_category_id,
                        'expense_category': ExpenseCategoryInstance.expense_category,
                        'total_amount': record.get('total_amount')
                    }
                    ExpenseDetailsList.append(data)



            else:
                ExpenseDetailsList = []

            IncomeDetailsList = []
            # Connect With Other Income table
            try:

                # Get income records grouped by category
                IncomePaymentRecords = (
                    OtherIncomeDetail.objects.filter(
                        income_id__organization=organization,
                        income_id__batch=batch_id,
                        income_id__income_date__gte=from_date,
                        income_id__income_date__lte=to_date,
                        is_active=True
                    )
                    .values("category_id")
                    .annotate(total_amount=Sum("amount"))
                )

            except Exception as e:

                IncomePaymentRecords = []

            # Check IncomePaymentRecords Having Data Or Not
            if IncomePaymentRecords:

                for record in IncomePaymentRecords:
                    ExpenseCategoryInstance = ExpenseCategoryMaster.objects.get(
                        expense_category_id=record.get('category_id'))

                    # Set Response Record

                    data = {
                        # 'category_id': ExpenseCategoryInstance.expense_category_id,
                        'expense_category': ExpenseCategoryInstance.expense_category,
                        'total_amount': record.get('total_amount')
                    }

                    IncomeDetailsList.append(data)

            # Get Received Fees Record

            try:
                FeesReceiptPaymentRecord = (
                    StudentFeeReceiptDetail.objects.filter(
                        receipt_id__org_id=organization,
                        receipt_id__batch_id=batch_id,
                        # receipt_id__receipt_date__date__gte= from_date,
                        # receipt_id__receipt_date__date__lte= to_date,
                        receipt_id__receipt_date__date__range=[from_date, to_date],
                        is_active=True
                    )
                    .values("fee_detail_id__element_name")
                    .annotate(total_amount=Sum("amount"))
                )
            except Exception as e:
                # print(f"Error fetching fee receipt records: {e}")
                FeesReceiptPaymentRecord = []

            if FeesReceiptPaymentRecord:
                for record in FeesReceiptPaymentRecord:
                    data = {
                        # 'category_id': ExpenseCategoryInstance.expense_category_id,
                        'expense_category': record.get('fee_detail_id__element_name'),
                        'total_amount': record.get('total_amount')
                    }

                    IncomeDetailsList.append(data)

            # final response data

            responseData = {
                'ExpenseDetails': ExpenseDetailsList,
                'IncomeDetails': IncomeDetailsList
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

            process_name='Profit&LossList',

            message=error_message[:200],

            data='',

        )


class AddIncomeCreateAPIView(CreateAPIView):
    serializer_class = AddIncomeSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)

                # Get validated data
                IncomeHeaderDetails_data = serializer.validated_data.get('IncomeHeaderDetails')
                IncomeDetails_list = serializer.validated_data.get('IncomeDetails')

                # print(expense_header_data)
                if not IncomeHeaderDetails_data:
                    return Response(
                        {'error': 'please provide IncomeHeaderDetails_data.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if not IncomeDetails_list:
                    return Response(
                        {'error': 'please provide IncomeDetails_list.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Fetch organization, branch, and party master instances
                try:
                    organizationInstance = Organization.objects.get(id=IncomeHeaderDetails_data.get('org_id'),
                                                                    is_active=True)

                    # batch_id is required by model, but frontend might send AcademicYear ID or Branch ID as batch_id or separately
                    provided_batch_id = IncomeHeaderDetails_data.get('batch_id')
                    provided_ay_id = IncomeHeaderDetails_data.get('academic_year_id')
                    
                    batchInstance = None
                    
                    # 1. Try resolving using provided batch_id (check if it's an AcademicYear ID first as common in frontend)
                    if provided_batch_id:
                         try:
                            # Check if it's an AcademicYear ID
                            ay = AcademicYear.objects.filter(id=provided_batch_id).first()
                            if ay:
                                branch_id_from_ay = ay.branch.id
                                batchInstance = Batch.objects.filter(branch_id=branch_id_from_ay, is_active=True).first()
                         except Exception:
                             pass
                    
                    # 2. Try resolving provided batch_id as Branch ID
                    if not batchInstance and provided_batch_id:
                        try:
                             batchInstance = Batch.objects.filter(branch_id=provided_batch_id, is_active=True).first()
                        except Exception:
                            pass

                    # 3. Try resolving provided batch_id as Batch ID
                    if not batchInstance and provided_batch_id:
                        try:
                            batchInstance = Batch.objects.filter(id=provided_batch_id, is_active=True).first()
                        except Exception:
                            pass
                    
                     # 4. If still no batch, try using academic_year_id to find batch
                    if not batchInstance and provided_ay_id:
                        try:
                            ay = AcademicYear.objects.get(id=provided_ay_id)
                            # Use AY's batch directly if available, or fetch active batch for its branch
                            # Depending on model, AY has 'batch' FK.
                            batchInstance = ay.batch
                            if not batchInstance: # Fallback if for some reason AY -> Batch link is broken/odd
                                 batchInstance = Batch.objects.filter(branch_id=ay.branch.id, is_active=True).first()
                        except Exception:
                            pass

                    if not batchInstance:
                        return Response({'error': 'Active Batch not found for provided IDs'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    # Resolve Academic Year Instance
                    # If we found AY earlier, use it. Otherwise try to get from provided_ay_id
                    academicYearInstance = None
                    if provided_ay_id:
                         try:
                            academicYearInstance = AcademicYear.objects.get(id=provided_ay_id, is_active=True)
                         except AcademicYear.DoesNotExist:
                             pass # Will handle missing AY below if needed
                    
                    # If still no AY and batchInstance is found, maybe we don't strictly *need* AY if model allows null, 
                    # but model definition in previous turns showed it might be required.
                    # The original code did: academicYearInstance = AcademicYear.objects.get(...)
                    # So we should enforce it if we can find it.
                    
                    if not academicYearInstance:
                         # If we identified provided_batch_id as an AY earlier
                         try:
                             possible_ay = AcademicYear.objects.filter(id=provided_batch_id).first()
                             if possible_ay:
                                 academicYearInstance = possible_ay
                         except:
                             pass

                    if not academicYearInstance:
                         return Response({'error': 'Academic year not found'}, status=status.HTTP_400_BAD_REQUEST)


                    party_masterInstance = PartyMaster.objects.get(party_id=IncomeHeaderDetails_data.get('party_id'),
                                                                   is_active=True)
                except Organization.DoesNotExist:
                    return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
                # Batch.DoesNotExist handled manually
                # AcademicYear.DoesNotExist handled manually
                except PartyMaster.DoesNotExist:
                    return Response({'error': 'PartyMaster not found'}, status=status.HTTP_400_BAD_REQUEST)
                BankInstance = None
                AccountInstance = None
                # bankInstance & Account Instance
                if IncomeHeaderDetails_data.get('bank'):

                    try:
                        BankInstance = Bank.objects.get(id=IncomeHeaderDetails_data.get('bank'), is_active=True)
                    except Bank.DoesNotExist:
                        return Response({'message': 'Bank not found'}, status=status.HTTP_400_BAD_REQUEST)

                if IncomeHeaderDetails_data.get('account'):

                    try:
                        AccountInstance = BankAccountDetail.objects.get(
                            id=IncomeHeaderDetails_data.get('account'), is_active=True)
                    except BankAccountDetail.DoesNotExist:
                        return Response({'message': 'Account not found'}, status=status.HTTP_400_BAD_REQUEST)

                # Insert Income header record
                try:
                    Income_header = OtherIncome.objects.create(
                        organization=organizationInstance,
                        batch=batchInstance, # Use resolved batchInstance
                        academic_year=academicYearInstance,
                        income_no=IncomeHeaderDetails_data.get('income_no'),
                        income_date=IncomeHeaderDetails_data.get('date'),
                        party_id=party_masterInstance,
                        payment_method=IncomeHeaderDetails_data.get('payment_method'),
                        bank_id=BankInstance if BankInstance else None,
                        account_id=AccountInstance if AccountInstance else None,
                        reference_no=IncomeHeaderDetails_data.get('party_reference') or None,
                        amount=IncomeHeaderDetails_data.get('total_amount'),
                        created_by=IncomeHeaderDetails_data.get('created_by'),
                        updated_by=IncomeHeaderDetails_data.get('created_by')

                    )
                except Exception as e:
                    return Response({'error': f'Error creating Income header: {str(e)}'},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                # Insert income details
                for Income_detail in IncomeDetails_list:
                    try:
                        category_id = Income_detail.get('category_id')

                        # Validate category_id is provided and not empty
                        if category_id is None or category_id == '':
                            return Response(
                                {'error': 'category_id is required for each income detail and cannot be empty'},
                                status=status.HTTP_400_BAD_REQUEST
                            )

                        try:
                            categoryInstance = ExpenseCategoryMaster.objects.get(
                                expense_category_id=category_id, is_active=True
                            )
                        except ExpenseCategoryMaster.DoesNotExist:
                            return Response(
                                {'error': f'Income Category with id {category_id} not found'},
                                status=status.HTTP_400_BAD_REQUEST
                            )

                        OtherIncomeDetail.objects.create(
                            income_id=Income_header,
                            category_id=categoryInstance,
                            amount=Income_detail.get('amount'),
                            remarks=Income_detail.get('remarks') or ''
                        )
                    except Exception as e:
                        return Response(
                            {'error': f'Error occurred while creating income detail: {str(e)}'},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                return Response({'message': 'success'}, status=status.HTTP_200_OK)

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

            processname='IncomeAdd',

            message=error_message,

        )


class IncomeNoGenerateListAPIView(ListAPIView):
    serializer_class = OtherIncomeSerializer

    def list(self, request, *args, **kwargs):
        try:
            # Get the maximum Income_no from the table
            # max_income_no = OtherIncome.objects.aggregate(Max('income_no'))['income_no'] or 0
            max_income_no = OtherIncome.objects.aggregate(Max('income_no')).get('income_no__max', 0) or 0

            # print(max_income_no)

            # If no expense_no exists, start from 1
            next_income_no = (max_income_no + 1) if max_income_no else 1

            return Response({"message": 'success', 'income_no': next_income_no}, status=status.HTTP_200_OK)

        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(

            request=str(request),

            processname='IncomeNoList',

            message=error_message,

        )


class IncomeSearchListAPIView(ListAPIView):
    serializer_class = IncomeSearchSerializer

    def list(self, request, *args, **kwargs):
        try:
            organization = request.query_params.get('org_id')
            batch_id = request.query_params.get('batch_id')
            academic_year_Id = request.query_params.get('academic_year_id')
            partyId = request.query_params.get('party_id')
            from_date = request.query_params.get('from_date')
            to_date = request.query_params.get('to_date')
            payment_method = request.query_params.get('payment_method')
            bankId = request.query_params.get('bankId')
            accountId = request.query_params.get('accountId')
            party_reference = request.query_params.get('party_reference')

            if not organization:
                return Response({'message': 'Please Provide OrgId'}, status=status.HTTP_200_OK)

            if not batch_id:
                return Response({'message': 'Please Provide batch_id'}, status=status.HTTP_200_OK)

            if not academic_year_Id:
                return Response({'message': 'Please Provide academic_year Id'}, status=status.HTTP_200_OK)

            # Resolve Batch/Branch ID for filtering
            possible_batches = {batch_id}
            if batch_id:
                try:
                    # 1. Treat as AcademicYear ID
                    ay = AcademicYear.objects.filter(id=batch_id).first()
                    if ay:
                         possible_batches.add(ay.batch.id)
                         # Also active batch for the branch
                         branch_id_from_ay = ay.branch.id
                         branch_batches = Batch.objects.filter(branch_id=branch_id_from_ay, is_active=True).values_list('id', flat=True)
                         possible_batches.update(branch_batches)

                    # 2. Treat as Branch ID
                    branch_batches = Batch.objects.filter(branch_id=batch_id, is_active=True).values_list('id', flat=True)
                    possible_batches.update(branch_batches)
                    
                    # 3. Treat as Batch ID (already added)
                except Exception:
                    pass

            try:
                # Filter by organization and the resolved set of batch IDs
                # We relax the strict academic_year_id filter here because records might be linked to the Batch
                # effectively covering the academic year. If academic_year_id is provided and valid, we *can* use it,
                # but strict filtering might cause "No Record Found" if there's a slight mismatch in how AY is tracked vs Batch.
                # Given user context, primary scoping is Org + Batch.
                
                filterdata = OtherIncome.objects.filter(
                    organization_id=organization, 
                    batch_id__in=possible_batches,
                    is_active=True
                )
                
                # Optionally apply academic_year_id filter if it's explicitly strictly required, 
                # but often 'batch_id' (resolved) is sufficient and more reliable. 
                # If we want to support filtering by AY if passed:
                if academic_year_Id:
                     # Check if data exists with this AY, otherwise don't restrict too much if it returns nothing?
                     # Standard behavior is AND filtering.
                     filterdata = filterdata.filter(academic_year_id=academic_year_Id)
                     
            except ObjectDoesNotExist:
                filterdata = None

            if filterdata:

                if partyId:
                    filterdata = filterdata.filter(party_id=partyId)

                if from_date:
                    filterdata = filterdata.filter(income_date__gte=from_date)

                if to_date:
                    filterdata = filterdata.filter(income_date__lte=to_date)

                if payment_method:
                    filterdata = filterdata.filter(payment_method__iexact=payment_method)

                if bankId:
                    filterdata = filterdata.filter(bank_id=bankId)
                if accountId:
                    filterdata = filterdata.filter(account_id=accountId)

                if party_reference:
                    filterdata = filterdata.filter(reference_no=party_reference)

                finalResponseData = []
                if filterdata:
                    for item in filterdata:
                        data = {
                            'income_id': item.income_id,
                            'income_no': item.income_no,
                            'income_date': item.income_date,
                            'party_id': item.party_id.party_id,
                            'partyName': item.party_id.party_name,
                            'payment_method': item.payment_method,
                            'bankId': item.bank_id.id if item.bank_id else None,
                            'bankName': item.bank_id.bank_name if item.bank_id else None,
                            'accountId': item.account_id.id if item.account_id else None,
                            'account_name': item.account_id.bank_account if item.account_id else None,
                            'amount': item.amount,
                            'party_reference': item.reference_no
                        }

                        finalResponseData.append(data)
                    return Response({'message': 'success', 'data': finalResponseData}, status=status.HTTP_200_OK)

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

            request=str(request)[:100],

            process_name='IncomeSearchList',

            message=error_message[:200],

            data='',

        )


class IncomeRetriveListAPIView(RetrieveAPIView):
    serializer_class = AddIncomeSerializer

    def retrieve(self, request, *args, **kwargs):
        try:
            IncomeId = self.kwargs.get('pk')

            try:
                IncomeInstance = OtherIncome.objects.get(income_id=IncomeId, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Income Id Not Found'}, status=status.HTTP_404_NOT_FOUND)

            try:
                OtherIncomeDetailList = OtherIncomeDetail.objects.filter(income_id=IncomeId, is_active=True)
            except:
                OtherIncomeDetailList = None

            IncomeDetailsrecord = []
            if OtherIncomeDetailList:

                for record in OtherIncomeDetailList:
                    data = {
                        'income_detail_id': record.income_detail_id,
                        'income_id': record.income_id.income_id,
                        'category_id': record.category_id.expense_category_id,
                        'Income_category_id': record.category_id.expense_category,
                        'amount': record.amount,
                        'remarks': record.remarks

                    }
                    IncomeDetailsrecord.append(data)

            # Make Final Response

            responseData = {

                'income_id': IncomeInstance.income_id,
                'party_id': IncomeInstance.party_id.party_id,
                'party_name': IncomeInstance.party_id.party_name,
                'org_id': IncomeInstance.organization.id,
                'OrganizationName': IncomeInstance.organization.organization_code,
                'batch_id': IncomeInstance.batch.id,
                'batch_name': IncomeInstance.batch.batch_code,
                'bank_id': IncomeInstance.bank_id.id if IncomeInstance.bank_id else None,
                'bankName': IncomeInstance.bank_id.bank_name if IncomeInstance.bank_id else None,
                'account_id': IncomeInstance.account_id.id if IncomeInstance.account_id else None,
                'accountNo': IncomeInstance.account_id.bank_account if IncomeInstance.account_id else None,
                'income_date': IncomeInstance.income_date,
                'income_no': IncomeInstance.income_no,
                'party_reference': IncomeInstance.reference_no,
                'payment_method': IncomeInstance.payment_method,
                'amount': IncomeInstance.amount,
                'IncomeDetailsdata': IncomeDetailsrecord,

            }

            return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)

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

            processname='IncomedetialsRetrieve',

            message=error_message,

        )


class IncomeUpdateAPIView(UpdateAPIView):
    queryset = OtherIncome.objects.all()
    serializer_class = AddIncomeUpdateSerializer

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            IncomeInstance = self.get_object()

            # Get the input data
            IncomeHeaderDetails = request.data.get('IncomeHeaderDetails', {})
            IncomeDetails = request.data.get('IncomeDetails', [])

            if not IncomeHeaderDetails:
                return Response({'message': 'IncomeHeaderDetails record Not Found'}, status=status.HTTP_400_BAD_REQUEST)

            if not IncomeDetails:
                return Response({'message': 'IncomeDetails record Not Found'}, status=status.HTTP_400_BAD_REQUEST)

            # Update the IncomeHeader Record
            if IncomeHeaderDetails:
                try:
                    OrganizationInstance = Organization.objects.get(id=IncomeHeaderDetails.get('org_id'),
                                                                    is_active=True)
                    # Resolve Batch ID (Logic replicated from Create view to handle ambiguity)
                    provided_batch_id = IncomeHeaderDetails.get('batch_id')
                    BatchInstance = None
                    
                    if provided_batch_id:
                        # 1. Try as AcademicYear
                        try:
                            ay = AcademicYear.objects.filter(id=provided_batch_id).first()
                            if ay:
                                branch_id_from_ay = ay.branch.id
                                BatchInstance = Batch.objects.filter(branch_id=branch_id_from_ay, is_active=True).first()
                        except Exception:
                            pass
                            
                        # 2. Try as Branch ID
                        if not BatchInstance:
                             try:
                                  BatchInstance = Batch.objects.filter(branch_id=provided_batch_id, is_active=True).first()
                             except Exception:
                                pass
                                
                        # 3. Try as Batch ID
                        if not BatchInstance:
                            try:
                                BatchInstance = Batch.objects.filter(id=provided_batch_id, is_active=True).first()
                            except Exception:
                                pass

                    if not BatchInstance:
                        raise Batch.DoesNotExist("Batch matching query does not exist.")
                    academicYearInstance = AcademicYear.objects.get(
                        id=IncomeHeaderDetails.get('academic_year_id'), is_active=True)
                    partyInstance = PartyMaster.objects.get(party_id=IncomeHeaderDetails.get('party_id'),
                                                            is_active=True)
                except ObjectDoesNotExist as e:
                    transaction.set_rollback(True)  # Explicitly set the rollback flag
                    return Response({'message': f'Please provide valid {str(e).split(" ")[-1]} Id'},
                                    status=status.HTTP_400_BAD_REQUEST)

                bankInstance = None
                if IncomeHeaderDetails.get('bank'):
                    try:
                        bankInstance = Bank.objects.get(id=IncomeHeaderDetails.get('bank'), is_active=True)
                    except ObjectDoesNotExist:
                        bankInstance = None

                AccountInstance = None
                if IncomeHeaderDetails.get('account'):
                    try:
                        AccountInstance = BankAccountDetail.objects.get(id=IncomeHeaderDetails.get('account'),
                                                                        is_active=True)
                    except ObjectDoesNotExist:
                        AccountInstance = None

                # Update the Income Header Record
                IncomeInstance.org_id = OrganizationInstance
                IncomeInstance.batch_id = BatchInstance
                IncomeInstance.academic_year_id = academicYearInstance
                IncomeInstance.income_no = IncomeHeaderDetails.get('income_no')
                IncomeInstance.income_date = IncomeHeaderDetails.get('date')
                IncomeInstance.party_id = partyInstance
                IncomeInstance.payment_method = IncomeHeaderDetails.get('payment_method')
                IncomeInstance.bank_id = bankInstance
                IncomeInstance.account_id = AccountInstance
                IncomeInstance.reference_no = IncomeHeaderDetails.get('party_reference')
                IncomeInstance.amount = IncomeHeaderDetails.get('total_amount')
                IncomeInstance.updated_by = IncomeHeaderDetails.get('updated_by')
                IncomeInstance.save()

                # Delete All Record
                OtherIncomeDetail.objects.filter(
                    income_id=IncomeInstance,
                ).update(is_active=False)

            # Update or create IncomeDetails records
            if IncomeDetails:
                for item in IncomeDetails:
                    income_detail_id = item.get('income_detail_id')

                    if income_detail_id == 0 or income_detail_id is None:
                        try:
                            categoryInstance = ExpenseCategoryMaster.objects.get(
                                expense_category_id=item.get('category_id'), is_active=True)
                        except ObjectDoesNotExist:
                            transaction.set_rollback(True)  # Rollback for invalid category
                            return Response({'message': 'Please provide a valid category ID'},
                                            status=status.HTTP_400_BAD_REQUEST)

                        # Bulk Create
                        # OtherIncomeDetail.objects.bulk_create([
                        #     OtherIncomeDetail(**item)
                        # ])
                        # Create the record correctly
                        OtherIncomeDetail.objects.create(
                            income_id=IncomeInstance,
                            category_id=categoryInstance,
                            amount=item.get('amount'),
                            remarks=item.get('remarks'),
                            is_active=True
                        )
                    else:
                        try:
                            IncomeDetailsInstance = OtherIncomeDetail.objects.get(income_detail_id=income_detail_id,
                                                                                  is_active=True)
                            IncomeCategoryInstance = ExpenseCategoryMaster.objects.get(
                                expense_category_id=item.get('category_id'), is_active=True)
                        except ObjectDoesNotExist:
                            transaction.set_rollback(True)  # Rollback for invalid income details or category
                            return Response({'message': 'Please Provide Valid Income Details or Category'},
                                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                        IncomeDetailsInstance.category_id = IncomeCategoryInstance
                        IncomeDetailsInstance.income_id = IncomeInstance
                        IncomeDetailsInstance.amount = item.get('amount')
                        IncomeDetailsInstance.remarks = item.get('remarks')
                        IncomeDetailsInstance.save()

            return Response({'message': 'success'}, status=status.HTTP_200_OK)

        except Http404:
            return Response({'message': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            return Response({'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            self.log_exception(request, str(e))
            # transaction.set_rollback(True)  # Rollback for database error
            return Response({'error': 'A database error occurred.' + str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            self.log_exception(request, str(e))
            # transaction.set_rollback(True)  # Rollback for unexpected errors
            return Response({'error': 'An unexpected error occurred.' + str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request),
            processname='IncomeUpdate',
            message=error_message,
        )


class DayBookListAPIView(ListAPIView):
    serializer_class = DayBookSerializer

    def list(self, request, *args, **kwargs):
        try:
            organization = request.query_params.get('organization_id')
            batch_id = request.query_params.get('batch_id')
            branch_id = request.query_params.get('branch_id')
            from_date = request.query_params.get('from_date')
            to_date = request.query_params.get('to_date')
            payment_method = request.query_params.get('payment_methodId')
            bankId = request.query_params.get('bankId')
            accountId = request.query_params.get('accountId')

            filter_id = batch_id if batch_id else branch_id

             # Correctly handle branch_id -> batch_id mapping
            if filter_id:
               try:
                   actual_batch = Batch.objects.filter(branch_id=filter_id, is_active=True).first()
                   if actual_batch:
                       filter_id = actual_batch.id
               except Exception:
                   pass

            if not organization or not filter_id or not from_date or not to_date or not payment_method:
                return Response(
                    {
                        "error": "organization_id, batch_id (or branch_id), from_date, to_date and payment_methodId are required."},
                    status=status.HTTP_400_BAD_REQUEST)

            # Get Expense Details

            ExpenseDetailsList = []

            try:
                # Convert to integers for proper filtering
                organization = int(organization) if organization else None
                filter_id = int(filter_id) if filter_id else None

                ExpensePaymentRecords = (
                    ExpensePaymentDetail.objects.filter(
                        ExpensePaymentId__ExpenseHeaderId__organization=organization,
                        ExpensePaymentId__ExpenseHeaderId__batch=filter_id,
                        ExpensePaymentId__ExpenseHeaderId__date__gte=from_date,
                        ExpensePaymentId__ExpenseHeaderId__date__lte=to_date,
                        is_active=True
                    ))
            except Exception as e:
                ExpensePaymentRecords = []

            # print(ExpensePaymentRecords)
            # print('****1')

            if ExpensePaymentRecords:
                if payment_method:

                    # Later it will be change after payment method field connect with foreign key

                    # Now get payment merthod name
                    try:
                        PaymentMethodInstance = PaymentMethod.objects.get(id=payment_method)
                    except:
                        return Response({'message': 'No record Found'}, status=status.HTTP_400_BAD_REQUEST)

                    # print(PaymentMethodInstance)
                    # print('****2')

                    ExpensePaymentRecords = ExpensePaymentRecords.filter(
                        payment_method__icontains=PaymentMethodInstance.payment_method)

                    if bankId:
                        ExpensePaymentRecords = ExpensePaymentRecords.filter(
                            bankId=bankId)

                    if accountId:
                        ExpensePaymentRecords = ExpensePaymentRecords.filter(
                            bank_accountId=accountId)

                    # print(ExpensePaymentRecords)
                    # print('****3')

                # Set the response for Expense Record
                # print(ExpensePaymentRecords)
                for record in ExpensePaymentRecords:
                    # print(record)
                    data = {
                        'expense_no': record.ExpensePaymentId.ExpenseHeaderId.expense_no,
                        'party_name': record.ExpensePaymentId.ExpenseHeaderId.party.party_name,
                        'party_reference': record.ExpensePaymentId.ExpenseHeaderId.party_reference,
                        'payment_amount': record.ExpensePaymentId.payment_amount,
                        'payment_method': record.payment_method

                    }
                    # print(data)

                    ExpenseDetailsList.append(data)



            else:
                ExpenseDetailsList = []

            # Get Other Incomes

            OtherIncomeDetailList = []

            try:
                OtherIncomePaymentRecords = (
                    OtherIncome.objects.filter(
                        organization_id=organization,
                        batch_id=filter_id,
                        income_date__gte=from_date,
                        income_date__lte=to_date,
                        is_active=True
                    ))
            except Exception as e:

                OtherIncomePaymentRecords = []

            if OtherIncomePaymentRecords:
                if payment_method:

                    # Later it will be change after payment method field connect with foreign key

                    # Now get payment merthod name

                    try:
                        PaymentMethodInstance = PaymentMethod.objects.get(id=payment_method)
                    except:
                        return Response({'message': 'No record Found'}, status=status.HTTP_400_BAD_REQUEST)

                    OtherIncomePaymentRecords = OtherIncomePaymentRecords.filter(
                        payment_method__icontains=PaymentMethodInstance.payment_method)

                    if bankId:
                        OtherIncomePaymentRecords = OtherIncomePaymentRecords.filter(
                            bank_id=bankId)

                    if accountId:
                        OtherIncomePaymentRecords = OtherIncomePaymentRecords.filter(
                            account_id=accountId)

                for record in OtherIncomePaymentRecords:
                    # print(record)
                    data = {
                        'income_no': record.income_no,
                        'party_name': record.party_id.party_name,
                        'party_reference': record.reference_no,
                        'payment_amount': record.amount,

                    }
                    # print(data)

                    OtherIncomeDetailList.append(data)



            else:
                OtherIncomeDetailList = []

            # Get Fee Receipt Details
            FeeReceiptDetailsList = []

            try:
                # Get the actual branch_id for fee receipts filtering
                actual_branch_id = branch_id
                if not actual_branch_id and filter_id:
                    # If branch_id not provided, extract it from the batch
                    try:
                        batch_instance = Batch.objects.get(id=filter_id, is_active=True)
                        actual_branch_id = batch_instance.branch.id
                    except Exception:
                        actual_branch_id = filter_id

                fee_from_datetime = datetime.strptime(from_date, '%Y-%m-%d')
                fee_to_datetime = datetime.strptime(to_date, '%Y-%m-%d') + timedelta(days=1)

                try:
                    fee_from_datetime = make_aware(fee_from_datetime)
                    fee_to_datetime = make_aware(fee_to_datetime)
                except:
                    pass

                FeeReceiptPaymentRecords = StudentPayment.objects.filter(
                    receipt__organization=organization,
                    receipt__branch=actual_branch_id,
                    receipt__receipt_date__gte=fee_from_datetime,
                    receipt__receipt_date__lt=fee_to_datetime,
                    is_active=True
                )
            except Exception as e:
                FeeReceiptPaymentRecords = []

            # print(FeeReceiptPaymentRecords)

            if FeeReceiptPaymentRecords:
                if payment_method:

                    FeeReceiptPaymentRecords = FeeReceiptPaymentRecords.filter(
                        payment_method_id=payment_method)

                    if bankId:
                        FeeReceiptPaymentRecords = FeeReceiptPaymentRecords.filter(
                            bank_id=bankId)

                    if accountId:
                        FeeReceiptPaymentRecords = FeeReceiptPaymentRecords.filter(
                            bank_account_id=accountId)

                for record in FeeReceiptPaymentRecords:

                    # get student_class Instance
                    try:
                        studentClassInstance = StudentCourse.objects.get(student=record.receipt.student,
                                                                         is_active=True)
                    except:
                        studentClassInstance = None

                    student_name = ""

                    if studentClassInstance:
                        # Get Student Name & class_name & section_name
                        student_name = ""

                        name_part = filter(None, [

                            studentClassInstance.student.first_name,
                            studentClassInstance.student.middle_name,
                            studentClassInstance.student.last_name

                        ])
                        student_name = " ".join(name_part)

                        # Class Instance

                    data = {
                        'receipt_no': record.receipt.receipt_no,
                        'student_name': student_name,
                        'college_admission_no': record.receipt.student.college_admission_no,
                        'course_name': studentClassInstance.course.course_code if studentClassInstance else None,
                        'department_name': studentClassInstance.department.department_code if studentClassInstance else None,
                        'semester_name': studentClassInstance.semester.semester_description if studentClassInstance and studentClassInstance.semester else None,
                        'semester_code': studentClassInstance.semester.semester_code if studentClassInstance and studentClassInstance.semester else None,
                        'section_name': studentClassInstance.section.section_name if studentClassInstance else None,
                        'payment_amount': record.amount,

                    }
                    # print(data)

                    FeeReceiptDetailsList.append(data)



            else:
                FeeReceiptDetailsList = []

            # final response
            responseData = {
                'ExpenseRecodData': ExpenseDetailsList,
                'OtherIncomeRecordData': OtherIncomeDetailList,
                'FeeReceiptRecordData': FeeReceiptDetailsList
            }

            return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)


        except Exception as e:

            # Log the exception

            error_message = str(e)

            self.log_exception(request, error_message)

            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):

        ExceptionTrack.objects.create(

            request=str(request),

            processname='DayBookList',

            message=error_message,

        )


class ExpenseLedgerListAPIView(ListAPIView):
    serializer_class = ExpenseLedgerSerializer

    def list(self, request, *args, **kwargs):

        try:
            organization = request.query_params.get('organization_id')
            batch_id = request.query_params.get('batch_id')
            from_date = request.query_params.get('from_date')
            to_date = request.query_params.get('to_date')
            payment_method = request.query_params.get('payment_method')
            party_id = request.query_params.get('party_id')
            Expense_category_id = request.query_params.get('Expense_category_id')

            # Correctly handle branch_id -> batch_id mapping
            if batch_id:
               try:
                   actual_batch = Batch.objects.filter(branch_id=batch_id, is_active=True).first()
                   if actual_batch:
                       batch_id = actual_batch.id
               except Exception:
                   pass

            # Get Filter Record
            try:
                ExpenseLedgerFilterRecords = ExpenseDetail.objects.filter(
                    expense_header__organization=organization,
                    expense_header__batch=batch_id,
                    expense_header__date__gte=from_date,
                    expense_header__date__lte=to_date,
                    is_active=True
                )
            except:
                ExpenseLedgerFilterRecords = []

            # print(ExpenseLedgerFilterRecords)
            # print(ExpenseLedgerFilterRecords)
            if ExpenseLedgerFilterRecords:
                if party_id:
                    ExpenseLedgerFilterRecords = ExpenseLedgerFilterRecords.filter(expense_header__party=party_id)

                if Expense_category_id:
                    ExpenseLedgerFilterRecords = ExpenseLedgerFilterRecords.filter(
                        expense_category__expense_category_id=Expense_category_id)

                # print(ExpenseLedgerFilterRecords)
                PaymentMethodInstance = None
                if payment_method:
                    # print(f'payment id is {payment_method}')

                    # Later it will be change to get payment method name to only Id work properly
                    try:
                        PaymentMethodInstance = PaymentMethod.objects.get(id=payment_method, is_active=True)
                    except:
                        return Response({'message': 'Please provide valid payment method'},
                                        status=status.HTTP_400_BAD_REQUEST)
                    # print(PaymentMethodInstance.payment_method)
                    # print(PaymentMethodInstance)

                    # Now I want to Filter based on Payment_method

                    # Now i want to get ExpensePayment id list based on Expense Header
                    # Step 1: Get payment IDs related to the filtered ExpenseHeaders
                    expense_payment_ids = ExpensePayment.objects.filter(
                        ExpenseHeaderId__in=ExpenseLedgerFilterRecords.values_list('expense_header', flat=True),
                        is_active=True
                    ).values_list('payment_id', flat=True)

                    # print(expense_payment_ids)

                    # Step 2: Get payment IDs that match the given payment_method
                    filtered_payment_ids = ExpensePaymentDetail.objects.filter(
                        ExpensePaymentId__in=expense_payment_ids,
                        payment_method__icontains=PaymentMethodInstance.payment_method,
                        is_active=True
                    ).values_list('ExpensePaymentId', flat=True)

                    # print(filtered_payment_ids)

                    # Step 3: Filter ExpenseLedger records based on the matching ExpenseHeaders
                    ExpenseLedgerFilterRecords = ExpenseLedgerFilterRecords.filter(
                        expense_header__expense_header_id__in=ExpensePayment.objects.filter(
                            payment_id__in=filtered_payment_ids
                        ).values_list('ExpenseHeaderId', flat=True)
                    )
                    # print(ExpenseLedgerFilterRecords)

                responseData = []
                if ExpenseLedgerFilterRecords:

                    for record in ExpenseLedgerFilterRecords:
                        data = {
                            'id': record.expense_detail_id,
                            'expenseHeaderId': record.expense_header.expense_header_id,
                            'date': record.expense_header.date,
                            'type': 'pmnt',
                            'payment_method': PaymentMethodInstance.payment_method if PaymentMethodInstance else 'Cash',
                            'remarks': record.remarks,
                            'total_amount': record.expense_header.total_amount,
                            'paid_amount': record.expense_header.paid_amount
                        }

                        responseData.append(data)

                return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)

                # # Filter Expense Ledger Record
                # ExpenseLedgerFilterRecords = ExpenseLedgerFilterRecords.filter(
                #     expense_header__expense_header_id__in= ExpensePayment.objects.filter(
                #         payment_method = PaymentMethodInstance.payment_method,is_active=True
                #     )
                # ) #.values_list('ExpenseHeaderId',flat=True)
                #
                # print(ExpenseLedgerFilterRecords)




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

            processname='ExpenseLidgerList',

            message=error_message,

        )


class FetchExpenseDetailsBasedOnExpenseNo(ListAPIView):
    serializer_class = ExpenseHeaderSerializer

    def list(self, request, *args, **kwargs):

        try:
            ExpenseNo = self.kwargs.get('expense_no')

            try:
                ExpenseHeaderInstance = ExpenseHeader.objects.get(expense_no=ExpenseNo, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Provided Id Not Found'}, status=status.HTTP_404_NOT_FOUND)

            try:
                ExpenseDetailList = ExpenseDetail.objects.filter(expense_header=ExpenseHeaderInstance.expense_header_id,
                                                                 is_active=True)
            except:
                ExpenseDetailList = None

            try:
                ExpensePaymentList = ExpensePayment.objects.filter(
                    ExpenseHeaderId=ExpenseHeaderInstance.expense_header_id, is_active=True)
            except:
                ExpensePaymentList = None

            ExpensePaymentrecord = []

            for record in ExpensePaymentList:

                # Get Details on ExpensePaymentDetail DB
                try:
                    ExpensePaymentDetailInstance = ExpensePaymentDetail.objects.get(
                        ExpensePaymentId=record.payment_id, is_active=True)
                except ObjectDoesNotExist:
                    ExpensePaymentDetailInstance = None

                data = {
                    'payment_detail_id': ExpensePaymentDetailInstance.payment_detail_id,
                    'ExpensePaymentId': ExpensePaymentDetailInstance.ExpensePaymentId.payment_id,
                    'applied_amount': ExpensePaymentDetailInstance.applied_amount,
                    'applied_date': ExpensePaymentDetailInstance.applied_date,
                    'payment_method': ExpensePaymentDetailInstance.payment_method,
                    'bankId': ExpensePaymentDetailInstance.bankId.id if ExpensePaymentDetailInstance.bankId else None,
                    'bank_name': ExpensePaymentDetailInstance.bankId.bank_name if ExpensePaymentDetailInstance.bankId else None,
                    'bank_accountId': ExpensePaymentDetailInstance.bank_accountId.id if ExpensePaymentDetailInstance.bank_accountId else None,
                    'bank_account': ExpensePaymentDetailInstance.bank_accountId.bank_account if ExpensePaymentDetailInstance.bank_accountId else None
                }

                ExpensePaymentrecord.append(data)

                # if ExpensePaymentDetailInstance:
                #     for paymentdetail in ExpensePaymentDetailInstance:
                #

            ExpenseDetailsrecord = []
            if ExpenseDetailList:

                for record in ExpenseDetailList:
                    data = {
                        'expense_detail_id': record.expense_detail_id,
                        'expense_categoryId': record.expense_category.expense_category_id,
                        'expense_category_name': record.expense_category.expense_category,
                        'amount': record.amount,
                        'remarks': record.remarks

                    }
                    ExpenseDetailsrecord.append(data)

            # Make Final Response

            responseData = {
                'expense_header_id': ExpenseHeaderInstance.expense_header_id,
                'party_id': ExpenseHeaderInstance.party.party_id,
                'party_name': ExpenseHeaderInstance.party.party_name,
                'date': ExpenseHeaderInstance.date,
                'expense_no': ExpenseHeaderInstance.expense_no,
                'party_reference': ExpenseHeaderInstance.party_reference,
                'total_amount': ExpenseHeaderInstance.total_amount,
                'paid_amount': ExpenseHeaderInstance.paid_amount,
                'balance_amount': ExpenseHeaderInstance.balance_amount,
                'ExpenseDetailsdata': ExpenseDetailsrecord,
                'PaymentDetailsData': ExpensePaymentrecord

            }

            return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)

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

            processname='ExpansedetialsList',

            message=error_message,

        )


class FetchInComeDetailsBasedOnIncomeNo(ListAPIView):
    serializer_class = OtherIncomeSerializer

    def list(self, request, *args, **kwargs):

        try:
            IncomeNo = self.kwargs.get('Income_no')

            try:
                IncomeInstance = OtherIncome.objects.get(income_no=IncomeNo, is_active=True)
            except ObjectDoesNotExist:
                return Response({'message': 'Income Id Not Found'}, status=status.HTTP_404_NOT_FOUND)

            try:
                OtherIncomeDetailList = OtherIncomeDetail.objects.filter(income_id=IncomeInstance.income_id,
                                                                         is_active=True)
            except:
                OtherIncomeDetailList = None

            IncomeDetailsrecord = []
            if OtherIncomeDetailList:

                for record in OtherIncomeDetailList:
                    data = {
                        'income_detail_id': record.income_detail_id,
                        'income_id': record.income_id.income_id,
                        'category_id': record.category_id.expense_category_id,
                        'Income_category_id': record.category_id.expense_category,
                        'amount': record.amount,
                        'remarks': record.remarks

                    }
                    IncomeDetailsrecord.append(data)

            # Make Final Response

            responseData = {

                'income_id': IncomeInstance.income_id,
                'party_id': IncomeInstance.party_id.party_id,
                'party_name': IncomeInstance.party_id.party_name,
                'org_id': IncomeInstance.organization.id,
                'OrganizationName': IncomeInstance.organization.organization_code,
                'batch_id': IncomeInstance.batch.id,
                'batch_name': IncomeInstance.batch.batch_code,
                'bank_id': IncomeInstance.bank_id.id if IncomeInstance.bank_id else None,
                'bankName': IncomeInstance.bank_id.bank_name if IncomeInstance.bank_id else None,
                'account_id': IncomeInstance.account_id.id if IncomeInstance.account_id else None,
                'accountNo': IncomeInstance.account_id.bank_account if IncomeInstance.account_id else None,
                'income_date': IncomeInstance.income_date,
                'income_no': IncomeInstance.income_no,
                'party_reference': IncomeInstance.reference_no,
                'payment_method': IncomeInstance.payment_method,
                'amount': IncomeInstance.amount,
                'IncomeDetailsdata': IncomeDetailsrecord,

            }

            return Response({'message': 'success', 'data': responseData}, status=status.HTTP_200_OK)

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

            processname='IncomedetialsList',

            message=error_message,

        )


class VerifyFeeReceiptDataAPIView(ListAPIView):
    """
    Endpoint to verify fee receipt data availability for a given organization.
    Useful for checking data before using DayBook API.
    """

    def list(self, request, *args, **kwargs):
        try:
            organization = request.query_params.get('organization_id')
            branch_id = request.query_params.get('branch_id')
            from_date = request.query_params.get('from_date')
            to_date = request.query_params.get('to_date')
            payment_method_id = request.query_params.get('payment_methodId')

            if not organization:
                return Response({
                    'error': 'Required parameter: organization_id'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Get receipt overview for organization
            all_receipts = StudentFeeReceiptHeader.objects.filter(
                organization=organization,
                is_active=True
            )

            total_receipts = all_receipts.count()

            date_range = all_receipts.aggregate(
                min_date=Min('receipt_date'),
                max_date=Max('receipt_date')
            )

            # Get available branch combinations
            branch_combinations = all_receipts.values('branch_id').annotate(
                count=Count('id')
            ).order_by('-count')

            # Filter results if parameters provided
            filtered_count = 0
            payment_count = 0
            available_payment_methods = []

            if from_date and to_date and branch_id:
                from_datetime = datetime.strptime(from_date, '%Y-%m-%d')
                to_datetime = datetime.strptime(to_date, '%Y-%m-%d') + timedelta(days=1)

                try:
                    from_datetime = make_aware(from_datetime)
                    to_datetime = make_aware(to_datetime)
                except:
                    pass

                filtered_receipts = all_receipts.filter(
                    branch=branch_id,
                    receipt_date__gte=from_datetime,
                    receipt_date__lt=to_datetime
                )
                filtered_count = filtered_receipts.count()

                student_payments = StudentPayment.objects.filter(
                    receipt__organization=organization,
                    receipt__branch=branch_id,
                    receipt__receipt_date__gte=from_datetime,
                    receipt__receipt_date__lt=to_datetime,
                    is_active=True
                )
                payment_count = student_payments.count()

                if payment_method_id:
                    payment_count = student_payments.filter(payment_method_id=payment_method_id).count()

                available_payment_methods = list(student_payments.values(
                    'payment_method__id',
                    'payment_method__payment_method'
                ).distinct())

            response_data = {
                'total_receipts': total_receipts,
                'date_range': {
                    'earliest': date_range['min_date'],
                    'latest': date_range['max_date']
                },
                'available_branches': list(branch_combinations),
                'filtered_results': {
                    'receipt_count': filtered_count,
                    'payment_count': payment_count,
                    'available_payment_methods': available_payment_methods
                } if from_date and to_date and branch_id else None
            }

            return Response({
                'message': 'success',
                'data': response_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            self.log_exception(request, str(e))
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_exception(self, request, error_message):
        ExceptionTrack.objects.create(
            request=str(request)[:100],
            process_name='VerifyFeeReceiptData',
            message=error_message[:200],
            data='',
        )