import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

  productForm: FormGroup;
  categories: any[] = [];
  municipalities: any[] = [];
  materials: any[] = [];

  availableAttributes = [
    { id: 1, name: 'Talla' },
    { id: 2, name: 'Color' },
    { id: 3, name: 'Sabor' },
    { id: 4, name: 'Peso/Gramaje' },
    { id: 5, name: 'Capacidad (ml/L)' },
    { id: 6, name: 'Cantidad (Caja x...)' }
  ];

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      shortDescription: ['', Validators.required],
      longDescription: [null], // Según API puede ser null
      notes: [''],
      dimensions: [''], // Agregado según tu CURL
      categoryId: [null, Validators.required],
      municipalityId: [null, Validators.required],
      materialId: [null], // Opcional
      productVariants: this.fb.array([this.createVariant()])
    });
  }

  ngOnInit() {
    this.loadFormData();
  }

  loadFormData() {
    this.productService.getCategories().subscribe(data => this.categories = data);
    this.productService.getMunicipalities().subscribe(data => this.municipalities = data);
    this.productService.getMaterials().subscribe(data => this.materials = data);
  }

  // --- GETTERS ---
  get variants() { 
    return this.productForm.get('productVariants') as FormArray; 
  }

  getAttributes(variantIndex: number) {
    return this.variants.at(variantIndex).get('attributeValues') as FormArray;
  }

  // --- GESTIÓN DE VARIANTES ---
  createVariant(): FormGroup {
    return this.fb.group({
      sku: ['', Validators.required],
      specificPrice: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      productImages: this.fb.array([
        this.fb.group({ 
          imageUrl: ['', Validators.required], 
          isPrimary: [true], 
          displayOrder: [1] 
        })
      ]),
      attributeValues: this.fb.array([]) // Opcional por defecto
    });
  }

  addVariant() { this.variants.push(this.createVariant()); }
  removeVariant(i: number) { this.variants.removeAt(i); }

  addAttribute(variantIndex: number) {
    this.getAttributes(variantIndex).push(this.fb.group({
      attributeId: [1, Validators.required],
      value: ['', Validators.required]
    }));
  }

  removeAttribute(variantIndex: number, attrIndex: number) {
    this.getAttributes(variantIndex).removeAt(attrIndex);
  }

  onFileSelected(event: any, variantIndex: number) {
    const file: File = event.target.files[0];
    if (file) {
      this.productService.uploadImage(file).subscribe({
        next: (url) => {
          const images = this.variants.at(variantIndex).get('productImages') as FormArray;
          images.at(0).patchValue({ imageUrl: url });
        }
      });
    }
  }

  autoGenerateSKU(index: number) {
    const name = this.productForm.get('name')?.value || 'PROD';
    const cleanName = name.trim().replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.variants.at(index).get('sku')?.setValue(`${cleanName}-${random}`);
  }

  // --- ENVÍO FINAL ---
  onSubmit() {
  if (this.productForm.valid) {
    const formValue = this.productForm.value;

    // Construimos el DTO exacto: CreateProductDto
    const productDto = {
      name: formValue.name,
      shortDescription: formValue.shortDescription,
      longDescription: formValue.longDescription || null, // Permite null
      categoryId: parseInt(formValue.categoryId, 10), // Asegura int64
      materialId: formValue.materialId ? parseInt(formValue.materialId, 10) : null, // Opcional
      municipalityId: parseInt(formValue.municipalityId, 10),
      notes: formValue.notes || "",
      dimensions: formValue.dimensions || "",
      
      // Mapeo de productVariants -> CreateProductVariantDto[]
      productVariants: formValue.productVariants.map((v: any) => ({
        sku: v.sku,
        specificPrice: parseFloat(v.specificPrice), // Asegura Double
        stock: parseInt(v.stock, 10), // Asegura int32
        
        // Mapeo de productImages -> CreateProductImageDto[]
        productImages: v.productImages.map((img: any) => ({
          imageUrl: img.imageUrl,
          isPrimary: !!img.isPrimary,
          displayOrder: parseInt(img.displayOrder, 10)
        })),

        // Mapeo de attributeValues -> CreateAttributeValueDto[]
        attributeValues: v.attributeValues.map((attr: any) => ({
          attributeId: parseInt(attr.attributeId, 10),
          value: attr.value
        }))
      }))
    };

    console.log('Enviando DTO al servidor:', productDto);

    this.productService.createProduct(productDto).subscribe({
      next: (response) => {
        alert('🎉 Producto creado exitosamente');
        this.resetForm();
      },
      error: (err) => {
        console.error('Error detallado del servidor:', err);
        alert('❌ Error al crear el producto. Revisa la consola.');
      }
    });
  } else {
    alert('⚠️ Formulario inválido. Revisa los campos obligatorios (*).');
  }
}

  resetForm() {
    this.productForm.reset();
    this.variants.clear();
    this.variants.push(this.createVariant());
  }
}