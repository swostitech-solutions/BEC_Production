from django.db import models
from Acadix.models import Organization, Branch

class MOU(models.Model):
    mou_id = models.AutoField(primary_key=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    mou_details = models.TextField()
    document_file = models.FileField(upload_to='mou_documents/')
    mou_date = models.DateTimeField(null=True, blank=True)  # Date and time when MOU was created
    created_by = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'MOU'
