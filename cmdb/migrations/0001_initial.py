# Generated by Django 3.0.7 on 2020-07-02 11:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=20)),
                ('password', models.CharField(max_length=16)),
                ('salt', models.CharField(max_length=16)),
                ('addr', models.CharField(max_length=50, null=True)),
                ('loc_lng', models.DecimalField(decimal_places=5, max_digits=9, null=True)),
                ('loc_lat', models.DecimalField(decimal_places=5, max_digits=9, null=True)),
                ('phone', models.CharField(max_length=11)),
            ],
        ),
        migrations.CreateModel(
            name='Shop',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('image', models.CharField(max_length=16)),
                ('desc', models.TextField()),
                ('addr', models.CharField(max_length=50)),
                ('loc_lng', models.DecimalField(decimal_places=5, max_digits=9)),
                ('loc_lat', models.DecimalField(decimal_places=5, max_digits=9)),
                ('avg_price', models.FloatField(default=0.0)),
                ('sales', models.IntegerField(default=0)),
                ('phone', models.CharField(max_length=11)),
                ('serving', models.BooleanField(default=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cmdb.User')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('remarks', models.CharField(max_length=50)),
                ('addr', models.CharField(max_length=50)),
                ('loc_lng', models.DecimalField(decimal_places=5, max_digits=9)),
                ('loc_lat', models.DecimalField(decimal_places=5, max_digits=9)),
                ('tm_ordered', models.BigIntegerField()),
                ('tm_finished', models.BigIntegerField(null=True)),
                ('shop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cmdb.Shop')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cmdb.User')),
            ],
        ),
        migrations.CreateModel(
            name='Dish',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('image', models.CharField(max_length=16)),
                ('desc', models.TextField()),
                ('price', models.IntegerField()),
                ('sales', models.IntegerField()),
                ('serving', models.BooleanField(default=True)),
                ('shop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cmdb.Shop')),
            ],
        ),
        migrations.CreateModel(
            name='TagShop',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('shop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cmdb.Shop')),
                ('tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cmdb.Tag')),
            ],
            options={
                'unique_together': {('shop_id', 'tag_id')},
            },
        ),
        migrations.CreateModel(
            name='DishOrder',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField()),
                ('dish', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cmdb.Dish')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cmdb.Order')),
            ],
            options={
                'unique_together': {('dish_id', 'order_id')},
            },
        ),
    ]
