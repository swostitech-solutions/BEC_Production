from rest_framework import serializers

from Library.models import BookCategory, BookSubCategory, BookLocation, LibraryBranch, \
    LibraryPurchase, LibraryBooksBarcode


class BookCategorySerializers(serializers.ModelSerializer):
    org_id = serializers.IntegerField(source='organization_id', write_only=True)
    branch_id = serializers.IntegerField(source='batch_id', write_only=True)
    
    class Meta:
        model = BookCategory
        fields = ['id', 'category_name', 'category_description', 'org_id', 'branch_id', 'organization', 'batch', 'is_active', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['organization', 'batch', 'created_at', 'updated_at']


class BookCategoryUpdateSerializers(serializers.ModelSerializer):
    org_id = serializers.IntegerField(source='organization_id', write_only=True)
    branch_id = serializers.IntegerField(source='batch_id', write_only=True)
    
    class Meta:
        model = BookCategory
        fields = ['id', 'category_name', 'category_description', 'org_id', 'branch_id', 'organization', 'batch', 'is_active', 'updated_by', 'created_at', 'updated_at']
        read_only_fields = ['organization', 'batch', 'created_at', 'updated_at']



class BookSubCategorySerializers(serializers.ModelSerializer):
    CategoryId = serializers.IntegerField(source='category_id', write_only=True)
    SubCategoryName = serializers.CharField(source='sub_category_name')
    Subcategory_description = serializers.CharField(source='sub_category_description', required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = BookSubCategory
        fields = ['id', 'CategoryId', 'SubCategoryName', 'Subcategory_description', 'category', 'is_active', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['category', 'created_at', 'updated_at']

class BookSubCategoryUpdateSerializers(serializers.ModelSerializer):
    CategoryId = serializers.IntegerField(source='category_id', write_only=True)
    SubCategoryName = serializers.CharField(source='sub_category_name')
    Subcategory_description = serializers.CharField(source='sub_category_description', required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = BookSubCategory
        fields = ['id', 'CategoryId', 'SubCategoryName', 'Subcategory_description', 'category', 'is_active', 'updated_by', 'created_at', 'updated_at']
        read_only_fields = ['category', 'created_at', 'updated_at']

class BookLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookLocation
        fields = ['id','book_location', 'book_location_desc', 'organization','batch','is_active','created_by','updated_by','created_at','updated_at']


class EmptyStringToNullIntegerField(serializers.IntegerField):
    def to_internal_value(self, data):
        if data == "":  # Convert empty string to None
            return None
        return super().to_internal_value(data)
    
    
class LibraryBookSerializer(serializers.Serializer):
    loginId = serializers.IntegerField(allow_null=False)
    academicyearId = serializers.IntegerField(allow_null=False)
    book_code = serializers.CharField(allow_null=False, allow_blank=False)
    book_name = serializers.CharField(allow_null=False, allow_blank=False)
    library_branch_Id = serializers.IntegerField(allow_null=True, required=False)
    book_category_Id = serializers.IntegerField(allow_null=False)
    book_sub_category_Id = serializers.IntegerField(allow_null=False)
    book_status = serializers.CharField(allow_null=False, allow_blank=False)
    total_no_of_copies = serializers.IntegerField(allow_null=True)
    org_id = serializers.IntegerField(allow_null=False)
    branch_id = serializers.IntegerField(allow_null=False)
    publisher = serializers.CharField(allow_null=True, allow_blank=True)
    author = serializers.CharField(allow_blank=True, allow_null=True)
    publish_year = serializers.CharField(allow_null=True, allow_blank=True)
    volume = EmptyStringToNullIntegerField(allow_null=True, required=False)
    front_cover = serializers.ImageField(allow_null=True, required=False)
    back_cover = serializers.ImageField(allow_null=True, required=False)
    edition = serializers.CharField(allow_null=True, allow_blank=True)
    pages = EmptyStringToNullIntegerField(allow_null=True, required=False)
    barcode_auto_generated = serializers.BooleanField(default=True, required=False)
    ISBN = serializers.CharField(allow_null=True, allow_blank=True)
    createdDate = serializers.DateField(allow_null=True)
    allow_issue = serializers.CharField(allow_null=True, allow_blank=True, max_length=1)
    type = serializers.CharField(allow_null=True, allow_blank=True)
    IssueNo = serializers.CharField(allow_null=True, allow_blank=True)
    Period = serializers.CharField(allow_null=True, allow_blank=True)


# class LibraryBookSerializer(serializers.Serializer):
#     loginId = serializers.IntegerField(allow_null=False)
#     academic_year_id = serializers.IntegerField(allow_null=False)
#     book_code = serializers.CharField(allow_null=False,allow_blank=False)
#     book_name = serializers.CharField(allow_null=False, allow_blank=False)
#     library_branch_Id = serializers.IntegerField(allow_null=False)
#     book_category_Id = serializers.IntegerField(allow_null=False)
#     book_sub_category_Id = serializers.IntegerField(allow_null=False)
#     book_status = serializers.CharField(allow_null=False,allow_blank=False)
#     total_no_of_copies = serializers.IntegerField(allow_null=True)
#     org_id = serializers.IntegerField(allow_null=False)
#     branch_id = serializers.IntegerField(allow_null=False)
#     publisher = serializers.CharField(allow_null=True,allow_blank=True)
#     author = serializers.CharField(allow_blank=True,allow_null=True)
#     publish_year = serializers.CharField(allow_null=True)
#     volume = serializers.IntegerField(allow_null=True, required=False)
#     front_cover = serializers.ImageField(allow_null=True,default='')
#     back_cover = serializers.ImageField(allow_null=True)
#     edition = serializers.CharField(allow_null=True,allow_blank=True)
#     pages = serializers.IntegerField(allow_null=True,required=False)
#     barcode_auto_generated= serializers.BooleanField(default=True)
#     ISBN = serializers.CharField(allow_null=True,allow_blank=True)
#     createdDate= serializers.DateField(allow_null=True)
#     allow_issue = serializers.CharField(allow_null=True,allow_blank=True,max_length=1)
#     type = serializers.CharField(allow_null=True,allow_blank=True)
#     IssueNo =serializers.CharField(allow_null=True,allow_blank=True)
#     Period = serializers.CharField(allow_null=True,allow_blank=True)
#
#     def validate_volume(self, value):
#         if value == '':
#             return None
#         return value
#
#     def validate_pages(self, value):
#         if value == '':
#             return None
#         return value

class LibraryBookSearch(serializers.Serializer):
    academic_year_id= serializers.IntegerField(allow_null=False)
    book_code = serializers.CharField(allow_null=True,allow_blank=True)
    book_accession_no = serializers.CharField(allow_blank=True,allow_null=True)
    book_name = serializers.CharField(allow_null=True,allow_blank=True)
    author = serializers.CharField(allow_blank=True,allow_null=True)
    book_category = serializers.IntegerField(allow_null=True)
    book_sub_category = serializers.IntegerField(allow_null=True)
    library_branch = serializers.CharField(allow_null=True,allow_blank=True)
    location = serializers.IntegerField(allow_null=True)
    ISBN = serializers.CharField(allow_null=True,allow_blank=True)
    typeofbooks = serializers.CharField(allow_blank=True,allow_null=True)

class LibraryBranchSerializer(serializers.ModelSerializer):
    class Meta:
        models= LibraryBranch

        fields =['library_branch_id','library_branch_name','org_id','branch_id','is_active']

class LibraryPurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibraryPurchase
        fields = ['purchase_date','purchase_from','bill_no','bill_value','bill_concession','no_of_copies','created_by']

class LibraryBooksBarcodeSerializer(serializers.Serializer):
    barcode = serializers.CharField(allow_null=False, allow_blank=False)
    book_barcode_status = serializers.CharField(allow_null=True, allow_blank=True)
    remarks = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    barcode_auto_generated = serializers.BooleanField(default=True, required=False)
    org_id = serializers.IntegerField(allow_null=False)
    branch_id = serializers.IntegerField(allow_null=False)
    locationId = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    created_by = serializers.IntegerField(allow_null=True)


class LibraryBookCreateSerializer(serializers.Serializer):
    libraryBookdetails = LibraryBookSerializer(required=True)
    librarypurchesDetails = serializers.ListSerializer(child=LibraryPurchaseSerializer(), required=True)
    libraryBookBarcodeDetails = serializers.ListSerializer(child=LibraryBooksBarcodeSerializer(), required=True)


class LibraryBookUpdateSerializerRequest(serializers.Serializer):
    loginId = serializers.IntegerField(allow_null=False)
    bookId = serializers.IntegerField(allow_null=False)
    academic_year_id = serializers.IntegerField(allow_null=False)
    book_code = serializers.CharField(allow_null=False,allow_blank=False)
    book_name = serializers.CharField(allow_null=False, allow_blank=False)
    library_branch_Id = serializers.IntegerField(allow_null=False)
    book_category_Id = serializers.IntegerField(allow_null=False)
    book_sub_category_Id = serializers.IntegerField(allow_null=False)
    book_status = serializers.CharField(allow_null=False,allow_blank=False)
    total_no_of_copies = serializers.IntegerField(allow_null=True)
    org_id = serializers.IntegerField(allow_null=False)
    branch_id = serializers.IntegerField(allow_null=False)
    publisher = serializers.CharField(allow_null=True,allow_blank=True)
    author = serializers.CharField(allow_blank=True,allow_null=True)
    publish_year = serializers.DateField(allow_null=True)
    volume = serializers.IntegerField(allow_null=True)
    front_cover = serializers.ImageField(allow_null=True)
    back_cover = serializers.ImageField(allow_null=True)
    edition = serializers.CharField(allow_null=True,allow_blank=True)
    pages = serializers.IntegerField(allow_null=True)
    barcode_auto_generated= serializers.BooleanField(default=True)
    ISBN = serializers.CharField(allow_null=True,allow_blank=True)
    createdDate= serializers.CharField(allow_null=True,allow_blank=True)
    allow_issue = serializers.CharField(allow_null=True,allow_blank=True,max_length=1)
    type = serializers.CharField(allow_null=True,allow_blank=True)
    IssueNo =serializers.CharField(allow_null=True,allow_blank=True)
    Period = serializers.CharField(allow_null=True,allow_blank=True)

class LibraryPurchaseUpdateSerializer(serializers.ModelSerializer):
    bookId = serializers.IntegerField(source='book_id', write_only=True, required=False)
    
    class Meta:
        model = LibraryPurchase
        fields = ['id', 'bookId', 'purchase_date', 'purchase_from', 'bill_no', 'bill_value', 'bill_concession', 'no_of_copies', 'updated_by']

class LibraryBooksBarcodeUpdateSerializer(serializers.ModelSerializer):
    bookId = serializers.IntegerField(source='book_id', write_only=True, required=False)
    org_id = serializers.IntegerField(source='organization_id', write_only=True)
    branch_id = serializers.IntegerField(source='batch_id', write_only=True)
    locationId = serializers.IntegerField(source='location_id_id', write_only=True)
    
    class Meta:
        model = LibraryBooksBarcode
        fields = ['id', 'bookId', 'barcode', 'book_barcode_status', 'remarks', 'barcode_auto_generated', 'org_id', 'branch_id', 'locationId', 'updated_by']

class LibraryBookUpdateSerializer(serializers.Serializer):
    libraryBookdetails = LibraryBookUpdateSerializerRequest(required=True)
    librarypurchesDetails = serializers.ListSerializer(child=LibraryPurchaseUpdateSerializer(), required=True)
    libraryBookBarcodeDetails = serializers.ListSerializer(child=LibraryBooksBarcodeUpdateSerializer(), required=True)


class IssuesBookSearchSerializer(serializers.Serializer):
    academic_year_id= serializers.IntegerField(allow_null=False,required=True)
    teacher_id= serializers.IntegerField(allow_null=True)
    student_id = serializers.IntegerField(allow_null=True)
    course_id = serializers.IntegerField(allow_null=True)
    semester_id = serializers.IntegerField(allow_null=True)
    section_id = serializers.IntegerField(allow_null=True)
    book_title = serializers.CharField(allow_null=True,allow_blank=True)
    category_id = serializers.IntegerField(allow_null=True)
    subcategory_id = serializers.IntegerField(allow_null=True)
    issue_date = serializers.DateField(allow_null=True)
    return_date = serializers.DateField(allow_null=True)
    book_barcode_no = serializers.IntegerField(allow_null=True)
    flag= serializers.CharField(max_length=1,default='A')


class BookDetailsListSerializer(serializers.Serializer):
    barcode_id= serializers.IntegerField(allow_null=False)
    barcode_no = serializers.IntegerField(allow_null=False)



class BookIssuesSerializer(serializers.Serializer):
    academic_year_id = serializers.IntegerField(allow_null=False)
    staff_id= serializers.IntegerField(allow_null=True)
    student_id = serializers.IntegerField(allow_null=True)
    issue_date = serializers.DateField(allow_null=False)
    issues_book_details = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False,
    )
    created_by = serializers.IntegerField(allow_null=False)


class BookIssuedReturnSerializer(serializers.Serializer):
    student_id= serializers.IntegerField(allow_null=True)
    tracher_id = serializers.IntegerField(allow_null=True)
    book_issued_id= serializers.IntegerField(allow_null=False)
    return_date= serializers.DateField(required=True)
    returned_by = serializers.IntegerField(allow_null=False)
    penalty_amount = serializers.DecimalField(max_digits=18, decimal_places=2,allow_null=True)

    def validate(self, data):
        if "return_date" not in data:
            raise serializers.ValidationError({"return_date": "This field is required."})
        return data

class BookIssuedUpdateSerializer(serializers.Serializer):
    ReturnBooks = serializers.ListSerializer(child=BookIssuedReturnSerializer(),required=True)
    # created_by = serializers.IntegerField(required=True)
    academic_year_id = serializers.IntegerField(required=True)
    organization_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)

    # bookbarcodeId= serializers.IntegerField(allow_null=False)
    # return_date= serializers.DateField(allow_null=False)
    # returned_by = serializers.IntegerField(allow_null=False)




class BookTitleReportSerializer(serializers.Serializer):
    academic_year_id= serializers.IntegerField(required=True)
    organization_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    book_name = serializers.CharField(required=False)
    book_author = serializers.CharField(required=False)
    library_branch_id = serializers.IntegerField(required=False)
    category_id = serializers.IntegerField(required=False)
    subcategory_id = serializers.IntegerField(required=False)



class IssueReturnReportSerializer(serializers.Serializer):
    academic_year_id= serializers.IntegerField(required=True)
    fromDate = serializers.DateField(required=False)
    toDate = serializers.DateField(required=False)
    registrationNo = serializers.IntegerField(required=False)
    flag = serializers.CharField(max_length=1,default='A')


class CheckBookLostDamagedSerializer(serializers.Serializer):
    flag= serializers.CharField(max_length=20,required=True)

class LibraryBookReportSerializer(serializers.Serializer):
    academic_year_id = serializers.IntegerField(required=True)
    fromDate = serializers.DateField(required=False)
    toDate = serializers.DateField(required=False)

class LibraryBookBarcodeValidationSerializer(serializers.Serializer):
    barcodeList = serializers.ListField(required=True)


class LibraryBookConfigurationSerializer(serializers.Serializer):
    organization_id= serializers.IntegerField(required=True)
    batch_id= serializers.IntegerField(required=True)


class LibraryBookConfigurationUpdateSerializer(serializers.Serializer):
    organization_id = serializers.IntegerField(required=True)
    batch_id = serializers.IntegerField(required=True)
    ENABLE_LIBRARY_PENALITY= serializers.CharField(max_length=250,required=True)
    LIBRARY_BOOK_RETURN_DAYS = serializers.CharField(max_length=250, required=True)
    LIBRARY_BOOK_RETURN_MESSAGE_DAYS_PRIOR = serializers.CharField(max_length=250, required=True)

    LIBRARY_BOOK_RETURN_MESSAGE_SEND = serializers.CharField(max_length=250, required=True)
    LIBRARY_PENALITY_PER_DAY = serializers.CharField(max_length=250, required=True)
    MAX_BOOKS_ISSUED_STUDENT= serializers.CharField(max_length=250, required=True)
    MAX_BOOKS_ISSUED_TEACHER = serializers.CharField(max_length=250, required=True)