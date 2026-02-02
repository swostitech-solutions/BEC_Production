from django.urls import path

from Library import views

urlpatterns = [

    # Library Statistics
    path('api/LibraryStatistics/', views.LibraryStatisticsAPIView.as_view(), name='LibraryStatistics'),

    # Book Dashboard
    path('api/BookDashboard/', views.BookDashboardAPIView.as_view(), name='BookDashboard'),

    path('api/BookCategory/create/', views.BookCategoryCreateAPIView.as_view(), name='BookCategorycreate'),
    path('api/BookCategory/GetAllBookCategoryList/', views.BookCategoryListAPIView.as_view(), name='BookCategorylist'),
    path('api/BookCategory/BookCategoryupdate/<int:pk>', views.BookCategoryUpdateAPIView.as_view(),
         name='BookCategoryUpdate'),
    path('api/BookCategory/categorydelete/<int:pk>', views.BookCategoryDestroyAPIView.as_view(),
         name='BookCategorydelete'),

    path('api/BookSubCategory/create/', views.BookSubCategoryCreateAPIView.as_view(), name='BookSubCategorycreate'),
    path('api/BookSubCategory/GetBookSubCategoryBasedOnCategory/<int:pk>',
         views.GetAllBooksBasedOnCategoryWise.as_view(), name='GetSubCategoryList'),
    path('api/BookSubCategory/BookSubCategoryupdate/<int:pk>', views.BookSubCategoryUpdateAPIView.as_view(),
         name='BookSubCategoryUpdate'),
    path('api/BookSubCategory/subcategorydelete/<int:pk>', views.BookSubCategoryDestroyAPIView.as_view(),
         name='BooksubCategorydelete'),
    path('api/BookSubCategory/GetAllBookCategoryWithSubCategoryList/',
         views.GetAllCategorySubCategoryListAPIView.as_view(), name='GetCategoryWithSubCategoryList'),

    # BookLocation CRUD APIs
    path('api/BookLocation/create/', views.BookLocationCreateAPIView.as_view(), name='BookLocationCreate'),
    path('api/BookLocation/list/', views.BookLocationListAPIView.as_view(), name='BookLocationList'),
    path('api/BookLocation/update/<int:pk>/', views.BookLocationUpdateAPIView.as_view(), name='BookLocationUpdate'),
    path('api/BookLocation/delete/<int:pk>/', views.BookLocationDeleteAPIView.as_view(), name='BookLocationDelete'),

    path('api/LIBRARYBOOK/GetBooksearchList/', views.LibraryBookSearchAPIView.as_view(), name='BooksearchList'),
    path('api/LIBRARYBOOK/NextbarcodeNo/', views.NextBarcodeNumberListAPIView.as_view(), name='NextbarcodeNo'),
    path('api/LIBRARYBRANCH/GetLibraryBranchList/<int:org_id>/<int:branch_id>/',
         views.GetAllLibraryBranchListAPIView.as_view(), name='LibraryBranchesList'),
    path('api/LIBRARYBOOK/BOOK_CREATE/', views.LibraryBookCreateAPIView.as_view(), name='BOOKCREATE'),

    path('api/BOOK_LOCATION/GetALLBookLocationList/<int:org_id>/<int:branch_id>/',
         views.GetAllLibraryLocationListAPIView.as_view(), name='LibrarybooklocationList'),

    path('api/LIBRARYBOOK/GetBookDetailsBasedOnBookId/<int:bookId>/', views.GetLibraryBookBasedOnIdAPIView.as_view(),
         name='LibrarybookDetails'),

    path('api/LIBRARYBOOK/BOOK_UPDATE/', views.LibraryBookUpdateAPIView.as_view(), name='LibraryBookUpdate'),

    path('api/LIBRARYBOOK/GetAvailableBooksDetails/', views.BooksAvailableforIssues.as_view(),
         name='LibrarybookDetails'),

    path('api/ISSUEBOOK/BOOKISSUE_CREATE/', views.BookIssuesCreateAPIView.as_view(), name='LibraryBookIssues'),

    path('api/ISSUEBOOK/BOOKISSUESEARCHLIST/', views.BookIssuesSearchListAPIView.as_view(),
         name='LibraryBookIssuessearchlist'),

    path('api/ISSUEBOOK/BOOKRETURN/', views.BookRetrunedUpdateAPIView.as_view(), name='LibraryBookReturned'),

    path('api/LIBRARYBOOK/GetAllBooksDetails', views.AllBookBarcodeFilterListAPIView.as_view(), name='LibraryBooklist'),

    path('api/LIBRARYBOOK/GetAllBookTitleReport', views.BookTitleReportListAPIView.as_view(),
         name='LibraryBookTitleReport'),

    path('api/LIBRARYBOOK/GetAllJournalList/<int:academic_year_id>/', views.LibraryBookJournalReportList.as_view(),
         name='LibraryBookJournalReportList'),

    path('api/LIBRARYBOOK/GetIssueReturnSearchList', views.LibraryIssueReturnReportListAPIView.as_view(),
         name='IssueReturnSerachList'),

    path('api/LIBRARYBOOK/MostCirculatedBooklist/<int:academic_year_id>', views.MostCirculatedBookListAPIView.as_view(),
         name='MostCirculatedBooklist'),

    path('api/LIBRARYBOOK/LostDamagedlist/', views.GetLostDamageBookListAPIView.as_view(), name='LostDamagedlist'),

    path('api/LIBRARYBOOK/BookReportlist/', views.LibraryBookReportAPIView.as_view(), name='LibraryBookReport'),

    path('api/LIBRARYBOOK/LibraryBarcodeValidation/', views.LibraryBarcodeValidationAPIView.as_view(),
         name='LibraryBarcodeValidation'),

    path('api/LIBRARYBOOK/LibraryParameterConfigurationList/', views.LibraryParameterConfigurationListAPIView.as_view(),
         name='LibraryParameterConfigurationList'),

    path('api/LIBRARYBOOK/LibraryParameterConfigurationUpdate/', views.LibraryConfigurationUpdateAPIView.as_view(),
         name='LibraryBookConfigurationUpdate'),

]