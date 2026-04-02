from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Acadix", "0015_alter_coursedepartmentsubject_subject_code"),
    ]

    operations = [
        migrations.AlterField(
            model_name="department",
            name="department_code",
            field=models.CharField(max_length=255),
        ),
    ]
