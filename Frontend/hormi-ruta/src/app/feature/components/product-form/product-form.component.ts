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
  availableAttributes: any[] = [];

  //quemasdas => availableAttributes = [
    //{ id: 1, name: 'Talla' },
    //{ id: 2, name: 'Color' },
    //{ id: 3, name: 'Cantidad' },
    //{ id: 4, name: 'Sabor' },
    //{ id: 5, name: 'Peso/Gramaje' },
    //{ id: 6, name: 'Capacidad (ml/L)'}
    
  //];

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      shortDescription: ['', Validators.required],
      longDescription: [null],
      notes: [''],
      dimensions: [''],
      categoryId: [null, Validators.required],
      municipalityId: [null, Validators.required],
      materialId: [null],
      productVariants: this.fb.array([this.createVariant()])
    });
  }

  ngOnInit(): void {
    this.loadFormData();
  }

  loadFormData(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        if (data.length > 0) this.productForm.patchValue({ categoryId: data[0].id });
      },
      error: () => {
        this.categories = [
          { id: 1, name: 'Artesanías de Fique' },
          { id: 2, name: 'Bebidas tradicionales' },
          { id: 4, name: 'Dulces típicos' },
          { id: 3, name: 'Artesanías en barro' },
          { id: 5, name: 'Sabores de origen' }
        ];
      }
    });

    this.productService.getMunicipalities().subscribe({
      next: (data) =>{ this.municipalities = data;
      },
      error: () => {
        this.municipalities = [{ id: 1, name: 'Curití' }, { id: 2, name: 'Guane' }, { id: 3, name: 'Barichara' }];
      }
    });

    this.productService.getMaterials().subscribe({
      next: (data) => this.materials = data,
      error: () => {
        this.materials = [{ id: 1, name: 'Fique' }];
      }
    });
    this.productService.getAttributes().subscribe({
    next: (data) => {
      console.log('Atributos cargados desde el Backend');
      this.availableAttributes = data;
    },
    error: () => {
      console.warn('Usando atributos de emergencia');
      this.availableAttributes = [
        { id: 1, name: 'Talla' },
        { id: 2, name: 'Color' },
        { id: 3, name: 'Cantidad' },
        { id: 4, name: 'Sabor' },
        { id: 5, name: 'Peso/Gramaje' },
        { id: 6, name: 'Capacidad (ml/L)'}
      ];
    }
  });



  }

  get variants(): FormArray {
    return this.productForm.get('productVariants') as FormArray;
  }

  getAttributes(variantIndex: number): FormArray {
    return this.variants.at(variantIndex).get('attributeValues') as FormArray;
  }

  createVariant(): FormGroup {
    return this.fb.group({
      sku: ['', Validators.required],
      specificPrice: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      productImages: this.fb.array([
        this.fb.group({
          imageUrl: ['', Validators.required],
          isPrimary: [true],
          displayOrder: [1]
        })
      ]),
      attributeValues: this.fb.array([])
    });
  }

  addVariant(): void {
    this.variants.push(this.createVariant());
  }

  removeVariant(index: number): void {
    if (this.variants.length > 1) this.variants.removeAt(index);
  }

  addAttribute(variantIndex: number): void {
  const defaultId = this.availableAttributes.length > 0 ? this.availableAttributes[0].id : 1;
  
  this.getAttributes(variantIndex).push(this.fb.group({
    attributeId: [defaultId, Validators.required],
    value: ['', Validators.required]
  }));
}

  removeAttribute(variantIndex: number, attrIndex: number): void {
    this.getAttributes(variantIndex).removeAt(attrIndex);
  }

  autoGenerateSKU(index: number): void {
    const name = this.productForm.get('name')?.value || 'PROD';
    const cleanName = name.trim().toUpperCase().replace(/\s+/g, '').substring(0, 3);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.variants.at(index).get('sku')?.setValue(`${cleanName}-${random}`);
  }

  onFileSelected(event: any, variantIndex: number): void {
    const file: File = event.target.files[0];
    if (file) {
      this.productService.uploadImage(file).subscribe({
        next: (url) => {
          const images = this.variants.at(variantIndex).get('productImages') as FormArray;
          images.at(0).patchValue({ imageUrl: url });
        },
        error: () => alert('Error al subir imagen. Revisa la conexión.')
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const raw = this.productForm.value;

      const productDto = {
        name: raw.name,
        shortDescription: raw.shortDescription,
        longDescription: raw.longDescription || "",
        categoryId: Number(raw.categoryId),
        materialId: raw.materialId ? Number(raw.materialId) : null,
        municipalityId: Number(raw.municipalityId),
        notes: raw.notes || "",
        dimensions: raw.dimensions || "",
        productVariants: raw.productVariants.map((v: any) => ({
          sku: v.sku,
          specificPrice: Number(v.specificPrice),
          stock: Number(v.stock),
          productImages: v.productImages.map((img: any) => ({
            imageUrl: img.imageUrl,
            isPrimary: Boolean(img.isPrimary),
            displayOrder: Number(img.displayOrder)
          })),
          attributeValues: v.attributeValues.map((attr: any) => ({
            attributeId: Number(attr.attributeId),
            value: String(attr.value)
          }))
        }))
      };

      this.productService.createProduct(productDto).subscribe({
        next: () => {
          alert('Hormiguita feliz ¡Producto guardado exitosamente!');
          this.resetForm();
        },
        error: (err) => {
          console.error('Error detallado:', err);
          alert(' Error 400/500. Revisa que los IDs existan en el Back.');
        }
      });
    } else {
      alert(' Por favor completa los campos marcados con asterisco (*).');
    }
  }

  resetForm(): void {
    this.productForm.reset();
    this.variants.clear();
    this.variants.push(this.createVariant());
  }
}