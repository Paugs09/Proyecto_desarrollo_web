import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.services'; 
import { ProductDetail, ProductVariant } from '../../interfaces/product.interface';

@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  producto?: ProductDetail;
  imagenPrincipalUrl: string = '';
  cantidad = 1;

  // NUEVO: Para manejar la variante que está activa
  varianteSeleccionada?: ProductVariant;
  // Guardamos qué valor tiene cada atributo (ej: { "Talla": "37", "Referencia/Color": "Multicolor" })
  seleccionActual: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.getById(id).subscribe({
        next: (data) => {
          this.producto = data;
          if (this.producto && this.producto.variants.length > 0) {
            // Inicializamos con la primera variante
            this.seleccionarVariante(this.producto.variants[0]);
          }
        },
        error: (err) => console.error('Error cargando producto:', err)
      });
    }
  }

  // Setea toda la info basada en una variante
  seleccionarVariante(variant: ProductVariant) {
    this.varianteSeleccionada = variant;
    this.imagenPrincipalUrl = variant.images[0]?.imageUrl || '';
    
    // Llenamos el objeto de selección actual
    variant.values.forEach(v => {
      this.seleccionActual[v.attributeName] = v.value;
    });
  }

  // Para el HTML: Obtiene lista de botones (ej: todos los colores o todas las tallas)
  getValoresAtributo(nombreAtributo: string): string[] {
    const valores = new Set<string>();
    this.producto?.variants.forEach(v => {
      v.values.forEach(val => {
        if (val.attributeName === nombreAtributo) valores.add(val.value);
      });
    });
    return Array.from(valores);
  }

  // Cuando haces clic en un botón (ej: clic en talla 38)
  actualizarSeleccion(nombreAtributo: string, valor: string) {
    this.seleccionActual[nombreAtributo] = valor;
    
    // Buscamos si existe una variante que coincida con lo que el usuario quiere
    const coincidencia = this.producto?.variants.find(v => 
      v.values.every(val => this.seleccionActual[val.attributeName] === val.value)
    );

    if (coincidencia) {
      this.seleccionarVariante(coincidencia);
    } else {
      // Si no existe esa combinación (ej: no hay Multicolor en 37), 
      // buscamos la primera variante que sí tenga el valor que acabas de tocar
      const nuevaSugerencia = this.producto?.variants.find(v => 
        v.values.some(val => val.attributeName === nombreAtributo && val.value === valor)
      );
      if (nuevaSugerencia) this.seleccionarVariante(nuevaSugerencia);
    }
  }

  // Getters para el HTML
  get nombresAtributos(): string[] {
    if (!this.producto?.variants[0]) return [];
    return this.producto.variants[0].values.map(v => v.attributeName);
  }

  cambiarImagen(url: string) { this.imagenPrincipalUrl = url; }
  sumar() { this.cantidad++; }
  restar() { if (this.cantidad > 1) this.cantidad--; }
}