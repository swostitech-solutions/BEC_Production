from django.contrib import admin

from HOSTEL.models import Hostel, HostelBlock, HostelBlockFloor, HostelRoomType, HostelRoom, HostelRoomBed, \
    StudentHostelDetail

# Register your models here.
# Hostel,HostelBlock,HostelBlockFloor,HostelRoomType,HostelRoom,HostelRoomBed

admin.site.register(Hostel)
admin.site.register(HostelBlock)
admin.site.register(HostelBlockFloor)
admin.site.register(HostelRoomType)
admin.site.register(HostelRoom)
admin.site.register(HostelRoomBed)
admin.site.register(StudentHostelDetail)