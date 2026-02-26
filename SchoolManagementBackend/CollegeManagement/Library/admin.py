from django.contrib import admin

from Library.models import LibraryBranch,BookCategory,BookSubCategory,BookLocation,LibraryBook,LibraryPurchase,LibraryBooksBarcode,LibraryBooksIssues,ParameterValue

admin.site.register(LibraryBranch)
admin.site.register(BookCategory)
admin.site.register(BookSubCategory)
admin.site.register(BookLocation)
admin.site.register(LibraryBook)
admin.site.register(LibraryPurchase)
admin.site.register(LibraryBooksBarcode)
admin.site.register(LibraryBooksIssues)
admin.site.register(ParameterValue)








