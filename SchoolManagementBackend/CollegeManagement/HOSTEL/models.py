from django.db import models

from Acadix.models import Organization, Branch, Batch, StudentRegistration, StudentCourse, Course, Department, Semester, \
    Section, AcademicYear


# Create your models here.
class Hostel(models.Model):
    organization = models.ForeignKey(Organization,on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch,on_delete=models.CASCADE)
    hostel_name = models.CharField(max_length=255,null=False,blank=False)
    hostel_description = models.CharField(max_length=255,null=False,blank=False)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.hostel_name}'

class HostelBlock(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    block_name = models.CharField(max_length=100, null=False, blank=False)
    block_description = models.CharField(max_length=100, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.block_name}'
    # number_of_floors = models.CharField(max_length=10,null=False,blank=False)
    # number_of_floors = models.CharField(max_length=10,null=False,blank=False)

class HostelBlockFloor(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    hostel_block = models.ForeignKey(HostelBlock, on_delete=models.CASCADE)
    floor_number = models.CharField(max_length=10, null=False,blank=False)
    is_available = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.hostel_block.block_description}, Floor no. {self.floor_number}'
    # number_of_floors = models.CharField(max_length=10,null=False,blank=False)

class HostelRoomType(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    room_type = models.CharField(max_length=100, null=False, blank=False)
    room_type_description = models.CharField(max_length=100, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.room_type_description}'

class HostelRoom(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    hostel_block = models.ForeignKey(HostelBlock, on_delete=models.CASCADE)
    hostel_block_floor = models.ForeignKey(HostelBlockFloor, on_delete=models.CASCADE)
    room_type = models.ForeignKey(HostelRoomType, on_delete=models.CASCADE)
    room_number = models.CharField(max_length=10, null=False, blank=False)
    is_available = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Room.no - "{self.room_number}", Room_type-"{self.room_type.room_type}",Floor.no-"{self.hostel_block_floor.floor_number}",Block-"{self.hostel_block.block_description}",hostel-"{self.hostel.hostel_name}"'

class HostelRoomBed(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    hostel_block = models.ForeignKey(HostelBlock, on_delete=models.CASCADE)
    hostel_block_floor = models.ForeignKey(HostelBlockFloor, on_delete=models.CASCADE)
    room_type = models.ForeignKey(HostelRoomType, on_delete=models.CASCADE)
    room = models.ForeignKey(HostelRoom, on_delete=models.CASCADE)
    bed_number = models.CharField(max_length=100, null=False, blank=False)
    bed_cost = models.CharField(max_length=100, null=False, blank=False)
    is_available = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Bed no. {self.bed_number} - Cost - {self.bed_cost},{self.room.room_number},{self.room_type.room_type},{self.hostel_block_floor.floor_number},{self.hostel_block.block_description},{self.hostel.hostel_name}'

class StudentHostelDetail(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    hostel_block = models.ForeignKey(HostelBlock, on_delete=models.CASCADE)
    hostel_block_floor = models.ForeignKey(HostelBlockFloor, on_delete=models.CASCADE)
    room_type = models.ForeignKey(HostelRoomType, on_delete=models.CASCADE)
    room = models.ForeignKey(HostelRoom, on_delete=models.CASCADE)
    bed = models.ForeignKey(HostelRoomBed, on_delete=models.CASCADE)
    choice_semester = models.CharField(max_length=250, null=True, blank=True)
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    student_course = models.ForeignKey(StudentCourse, on_delete=models.CASCADE)
    # organization,branch,hostel,hostel_block,hostel_block_floor,room_type,room,bed,choice_semester,student,student_course
    # date_from = models.DateTimeField(null=False, blank=False)
    # date_to = models.DateTimeField(null=False, blank=False)
    # bed_cost = models.CharField(max_length=100, null=False, blank=False)
    # is_available = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_by = models.PositiveIntegerField()
    updated_by = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Bed no. {self.student.first_name}'

    # Hostel,HostelBlock,HostelBlockFloor,HostelRoomType,HostelRoom,HostelRoomBed



class Temp_Table_Hostel_Student(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)  # course
    department = models.ForeignKey(Department, on_delete=models.CASCADE)  # department
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)  # section
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, null=True, blank=True)
    hostel_block = models.ForeignKey(HostelBlock, on_delete=models.CASCADE, null=True, blank=True)
    hostel_block_floor = models.ForeignKey(HostelBlockFloor, on_delete=models.CASCADE, null=True, blank=True)
    room_type = models.ForeignKey(HostelRoomType, on_delete=models.CASCADE, null=True, blank=True)
    room = models.ForeignKey(HostelRoom, on_delete=models.CASCADE, null=True, blank=True)
    bed = models.ForeignKey(HostelRoomBed, on_delete=models.CASCADE, null=True, blank=True)
    student_course = models.ForeignKey(StudentCourse, on_delete=models.CASCADE)
    hostel_availed = models.BooleanField(default=False)
    # is_active = models.BooleanField(default=True)