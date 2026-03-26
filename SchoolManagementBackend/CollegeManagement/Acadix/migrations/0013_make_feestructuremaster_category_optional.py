from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Acadix', '0012_add_cancelled_by_fields_to_fee_receipt_header'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feestructuremaster',
            name='category',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to='Acadix.category',
            ),
        ),
    ]
