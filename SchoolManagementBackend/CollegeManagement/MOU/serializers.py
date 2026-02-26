from rest_framework import serializers
from .models import MOU

class MOUSerializer(serializers.ModelSerializer):
    class Meta:
        model = MOU
        fields = '__all__'
