from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Acadix", "0014_add_certificate_new_fields"),
    ]

    operations = [
        migrations.AlterField(
            model_name="coursedepartmentsubject",
            name="subject_code",
            field=models.CharField(max_length=255),
        ),
    ]
