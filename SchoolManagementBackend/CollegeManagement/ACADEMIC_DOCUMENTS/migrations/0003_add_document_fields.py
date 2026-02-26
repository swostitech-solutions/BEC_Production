from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ACADEMIC_DOCUMENTS', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='documentfile',
            name='remarks',
            field=models.TextField(blank=True, help_text='Notes or remarks about this document version', null=True),
        ),
        migrations.AddField(
            model_name='documentfile',
            name='from_date',
            field=models.DateField(blank=True, help_text='Valid from date', null=True),
        ),
        migrations.AddField(
            model_name='documentfile',
            name='to_date',
            field=models.DateField(blank=True, help_text='Valid to date', null=True),
        ),
    ]
