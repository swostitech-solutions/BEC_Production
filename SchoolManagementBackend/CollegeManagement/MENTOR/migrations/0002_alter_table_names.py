from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('MENTOR', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='Mentor',
            table='Mentor',
        ),
        migrations.AlterModelTable(
            name='MentorStudentCommunication',
            table='MentorStudentCommunication',
        ),
        migrations.AlterModelTable(
            name='StudentMentorAssignment',
            table='StudentMentorAssignment',
        ),
    ]
