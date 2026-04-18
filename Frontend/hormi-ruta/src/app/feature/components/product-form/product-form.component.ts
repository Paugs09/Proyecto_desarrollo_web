import { Component, inject } from '@angular/core';
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
export class ProductFormComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

  productForm: FormGroup;

  // IDs exactos obtenidos de Scalar
  categories = [
    { id: 1, name: 'Artesanías de Fique' },
    { id: 2, name: 'Bebidas tradicionales' },
    { id: 3, name: 'Artesanías en barro' },
    { id: 4, name: 'Dulces típicos' },
    { id: 5, name: 'Sabores de origen' }
  ];

  // Atributos dinámicos para la versatilidad del catálogo
  availableAttributes = [
    { id: 1, name: 'Talla' },
    { id: 2, name: 'Color' },
    { id: 3, name: 'Peso/Gramaje' },
    { id: 4, name: 'Capacidad (ml/L)' },
    { id: 5, name: 'Cantidad (Caja x...)' }
  ];

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      shortDescription: ['', Validators.required],
      longDescription: [''],
      categoryId: [1, Validators.required],
      municipalityId: [1, Validators.required], // 1 para Curití por defecto
      productVariants: this.fb.array([this.createVariant()])
    });
  }

  // Getter para acceder fácilmente a las variantes
  get variants() { 
    return this.productForm.get('productVariants') as FormArray; 
  }

  // Crea el grupo de formulario para una nueva variante
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
      attributeValues: this.fb.array([])
    });
  }

  // --- LÓGICA DE SUBIDA DE IMAGEN (Endpoint: /api/product/upload-image) ---
  onFileSelected(event: any, variantIndex: number) {
    const file: File = event.target.files[0];
    
    if (file) {
      console.log('Subiendo archivo al servidor:', file.name);

      this.productService.uploadImage(file).subscribe({
        next: (response: string) => {
          // Buscamos la variante y el array de imágenes correspondiente
          const variant = this.variants.at(variantIndex);
          const imagesArray = variant.get('productImages') as FormArray;
          
          // El Backend retorna la URL pública (Supabase) como texto puro
          imagesArray.at(0).patchValue({
            imageUrl: response,
            isPrimary: true,
            displayOrder: 1
          });

          alert('✅ Imagen subida con éxito y vinculada a la variante.');
        },
        error: (err) => {
          console.error('Error en la subida:', err);
          alert('❌ Error al subir la imagen. Verifica la conexión con el Backend.');
        }
      });
    }
  }

  // --- GESTIÓN DINÁMICA DE FORMULARIO ---
  addVariant() { 
    this.variants.push(this.createVariant()); 
  }

  removeVariant(i: number) { 
    this.variants.removeAt(i); 
  }

  getAttributes(variantIndex: number) {
    return this.variants.at(variantIndex).get('attributeValues') as FormArray;
  }

  addAttribute(variantIndex: number) {
    this.getAttributes(variantIndex).push(this.fb.group({
      attributeId: [1, Validators.required],
      value: ['', Validators.required]
    }));
  }

  removeAttribute(variantIndex: number, attrIndex: number) {
    this.getAttributes(variantIndex).removeAt(attrIndex);
  }

  // Envío final del producto (POST /api/product)
  onSubmit() {
    if (this.productForm.valid) {
      this.productService.createProduct(this.productForm.value).subscribe({
        next: () => {
          alert('🎉 ¡Producto creado con éxito en el catálogo!');
          this.productForm.reset();
          // Opcional: reiniciar a una variante vacía después del reset
          while (this.variants.length !== 0) {
            this.variants.removeAt(0);
          }
          this.variants.push(this.createVariant());
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          alert('❌ Error al guardar el producto. Revisa los datos.');
        }
      });
    } else {
      alert('⚠️ Por favor completa todos los campos obligatorios, incluyendo la subida de imagen.');
    }
  }
  autoGenerateSKU(index: number) {
  const name = this.productForm.get('name')?.value;
  const catId = this.productForm.get('categoryId')?.value;

  if (!name) {
    alert('Primero escribe el nombre del producto');
    return;
  }

  // Limpiamos el nombre: sin espacios, mayúsculas, solo 3 letras
  const cleanName = name.trim().replace(/\s+/g, '').substring(0, 3).toUpperCase();
  // Un número aleatorio para que no choque en Supabase
  const random = Math.floor(1000 + Math.random() * 9000);
  
  const suggestedSKU = `${cleanName}${catId}-${random}`;

  // Lo ponemos en el campo, pero el admin puede borrarlo y escribir otro
  this.variants.at(index).get('sku')?.setValue(suggestedSKU);
}



}