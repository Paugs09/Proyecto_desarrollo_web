import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs'; 

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isImageLoading = signal(false);
  isEditMode = false;
  editProductId?: number;
  isFormLoading = false;

  productForm: FormGroup;
  categories: any[] = [];
  municipalities: any[] = [];
  materials: any[] = [];
  availableAttributes: any[] = [];

  constructor() {
    // VALIDACIÓN EN FORMULARIO: Define los campos iniciales obligatorios que se requieren antes de admitir un registro
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
    const id = this.route.snapshot.paramMap.get('id');

    if (id) this.isFormLoading = true;

    // Sincronización: cargar diccionarios primero, luego el producto
    forkJoin({
      categories: this.productService.getCategories(),
      municipalities: this.productService.getMunicipalities(),
      materials: this.productService.getMaterials(),
      attributes: this.productService.getAttributes()
    }).subscribe({
      next: (res) => {
        this.categories = res.categories;
        this.municipalities = res.municipalities;
        this.materials = res.materials;
        this.availableAttributes = res.attributes;

        if (id) {
          this.isEditMode = true;
          this.editProductId = +id;
          this.loadProductForEdit(this.editProductId);
        } else {
          this.addVariant(); 
        }
      },
      error: () => {
        this.isFormLoading = false;
        this.showError('Error al cargar datos maestros del servidor');
      }
    });
  }


  loadProductForEdit(id: number): void {
    this.productService.getById(id).subscribe({
      next: (product: any) => {
        this.variants.clear();
        
        // VALIDACIÓN EN FORMULARIO: restricciones de valores mínimos (>= 0) para precio y stock
        product.variants.forEach((v: any) => {
          const variantGroup = this.fb.group({
            sku: [v.sku, Validators.required],
            specificPrice: [v.specificPrice, [Validators.required, Validators.min(0)]],
            stock: [v.stock, [Validators.required, Validators.min(0)]],
            productImages: this.fb.array([]),
            attributeValues: this.fb.array([])
          });

          // Imágenes
          const imagesArray = variantGroup.get('productImages') as FormArray;
          if (v.images) {
            v.images.forEach((img: any, idx: number) => {
              imagesArray.push(this.fb.group({
                imageUrl: [img.imageUrl, Validators.required],
                isPrimary: [img.isPrimary],
                displayOrder: [img.displayOrder ?? idx + 1]
              }));
            });
          }

          // Especificaciones
          const attrsArray = variantGroup.get('attributeValues') as FormArray;
          const sourceAttrs = v.attributeValues || v.values || [];
          sourceAttrs.forEach((attr: any) => {
            attrsArray.push(this.fb.group({
              attributeId: [attr.attributeId, Validators.required],
              value: [attr.value, Validators.required]
            }));
          });

          this.variants.push(variantGroup);
        });

        // Patch datos generales
        this.productForm.patchValue({
          name: product.productName,
          shortDescription: product.shortDescription,
          longDescription: product.longDescription,
          notes: product.notes,
          dimensions: product.dimensions,
          categoryId: product.categoryId,
          municipalityId: product.municipalityId,
          materialId: product.materialId
        });
        this.isFormLoading = false;
      },
      error: () => {
        this.isFormLoading = false; 
        this.showError('No se encontró el producto solicitado');
      }
    });
  }


  getProductImages(variantIndex: number): FormArray {
    return this.variants.at(variantIndex).get('productImages') as FormArray;
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
      next: (data) => {
        this.municipalities = data;
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
          { id: 6, name: 'Capacidad (ml/L)' }
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
 // VALIDACIÓN EN FORMULARIO
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

  // Permite añadir múltiples imágenes a una variante específica
  addImage(variantIndex: number): void {
    const images = this.variants.at(variantIndex).get('productImages') as FormArray;
    images.push(this.fb.group({
      // VALIDACIÓN EN FORMULARIO
      imageUrl: ['', Validators.required],
      isPrimary: [false],
      displayOrder: [images.length + 1]
    }));
  }

  //permitir borrar una imagen específica
  removeImage(variantIndex: number, imageIndex: number): void {
    const images = this.variants.at(variantIndex).get('productImages') as FormArray;
    if (images.length > 1) images.removeAt(imageIndex);
  }

  onFileSelected(event: any, variantIndex: number, imageIndex: number): void {
    const file: File = event.target.files[0];
    if (file) {
      this.isImageLoading.set(true);
      this.productService.uploadImage(file).subscribe({
        next: (url) => {
          const images = this.variants.at(variantIndex).get('productImages') as FormArray;
          images.at(imageIndex).patchValue({ imageUrl: url });
          this.isImageLoading.set(false);

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Imagen cargada',
            showConfirmButton: false,
            timer: 2000,
            background: '#ffffff',
            customClass: { popup: 'rounded-2xl border-2 border-[#3aa394]' }
          });
        },
        error: () => {
          this.isImageLoading.set(false);

          Swal.fire({
            title: '<span class="block text-center">¡Ups!</span>',
            html: '<p class="text-center">Error al subir la imagen. Revisa tu conexión.</p>',
            imageUrl: 'assets/Hormiga-triste.png',
            imageWidth: 100,
            confirmButtonColor: '#ec7272',
            background: '#ffffff',
            customClass: { popup: 'rounded-[3rem] border-8 border-white shadow-2xl' }
          });
        }
      });
    }
  }

  onSubmit(): void {
    // VALIDACIÓN FRONTEND: Frena inmediatamente la ejecución y alerta de forma visual al usuario si tiene datos que son inválidos
  if (this.productForm.invalid) {
    Swal.fire({
      title: '<span class="block text-center">Formulario incompleto</span>',
      html: '<p class="text-center">Por favor completa los campos obligatorios (*).</p>',
      icon: 'warning',
      confirmButtonColor: '#F4A261',
      background: '#ffffff',
      customClass: { popup: 'rounded-[2rem] text-center' }
    });
    return;
  }

  const raw = this.productForm.value;

  // Objeto base del producto
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

  const updateDto = {
    ...productDto
  };

  // Llamar a UPDATE o a CREATE
  if (this.isEditMode && this.editProductId) {
    // --- Lógica de edición ---
    this.productService.updateProduct(this.editProductId, updateDto).subscribe({
      next: () => {
        this.handleSuccessAlert('¡Producto actualizado!', 'Los cambios se guardaron correctamente.');
        this.router.navigate(['/products']);
      },
      // VALIDACIÓN FRONTEND
      error: (err) => {
        console.error('Error en edición:', err);
        this.handleErrorAlert('Error de edición', 'La base de datos rechazó los cambios. Revisa la consola.');
      }
    });
  } else {
    // --- Lógica de creación ---
    this.productService.createProduct(productDto).subscribe({
      next: () => {
        this.handleSuccessAlert('¡Hormiguita feliz!', 'El producto ha sido guardado exitosamente.');
        this.resetForm();
      },
      // VALIDACIÓN FRONTEND
      error: (err) => {
        console.error('Error en creación:', err);
        this.handleErrorAlert('Error de registro', 'No se pudo crear el producto.');
      }
    });
  }
}

// Formato moneda
  formatPrice(value: number | null): string {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('es-CO').format(value);
  }

  onPriceInput(event: any, variantIndex: number): void {
    const digits = event.target.value.replace(/\D/g, '');
    const parsed = parseInt(digits, 10) || 0;

    this.variants.at(variantIndex).get('specificPrice')?.setValue(parsed, { emitEvent: false });

    event.target.value = new Intl.NumberFormat('es-CO').format(parsed);

    const len = event.target.value.length;
    event.target.setSelectionRange(len, len);
  }
  
  resetForm(): void {
    this.productForm.reset();
    this.variants.clear();
    this.variants.push(this.createVariant());
  }

  // --- Manejo de alertas ---
  private showError(msg: string) {
    Swal.fire({
      title: '<span class="block text-center">¡Ups!</span>',
      html: `<p class="text-center">${msg}</p>`,
      imageUrl: 'assets/Hormiga-triste.png',
      imageWidth: 100,
      confirmButtonColor: '#FCA5A5',
      background: '#FBF5EC',
      customClass: { popup: 'rounded-[3rem] border-8 border-white' }
    });
  }
  private handleSuccessAlert(title: string, text: string) {
    Swal.fire({
      title: `<span class="block text-center">${title}</span>`,
      html: `<p class="text-center">${text}</p>`,
      imageUrl: 'assets/hormiga-feliz.gif',
      imageWidth: 150,
      confirmButtonColor: '#3aa394',
      background: '#ffffff',
      customClass: { popup: 'rounded-[3rem] border-8 border-white shadow-2xl' }
    });
  }

  private handleErrorAlert(title: string, text: string) {
    Swal.fire({
      title: `<span class="block text-center">${title}</span>`,
      html: `<p class="text-center">${text}</p>`,
      imageUrl: 'assets/Hormiga-triste.png',
      imageWidth: 120,
      confirmButtonColor: '#ec7272',
      background: '#ffffff',
      customClass: { popup: 'rounded-[3rem] border-8 border-white shadow-2xl' }
    });
  }
  // Método auxiliar para verificar si un campo del formulario general es inválido y fue manipulado
isFieldInvalid(field: string): boolean {
  const control = this.productForm.get(field);
  return !!(control && control.invalid && (control.dirty || control.touched));
}

// Método auxiliar para verificar campos dentro de los FormArray (Variantes)
isVariantFieldInvalid(variantIndex: number, field: string): boolean {
  const control = this.variants.at(variantIndex).get(field);
  return !!(control && control.invalid && (control.dirty || control.touched));
}
}