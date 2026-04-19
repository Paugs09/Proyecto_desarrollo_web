import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductDto } from '../../interfaces/product.interface';
import { Category } from '../../interfaces/category.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {

  isMenuOpen = false;
  isLoading = true;

  products: ProductDto[] = [];
  categories: Category[] = [];

  selectedCategoryId?: number;
  searchText = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    // Leer categoryId de la URL si viene del home
    this.route.queryParams
    .pipe(takeUntil(this.destroy$))
    .subscribe(params => {
      const catId = params['categoryId'];
      const name = params['productName'];
      this.selectedCategoryId = catId ? +catId : undefined;
      this.searchText = name ?? '';   
      this.loadProducts();
    });

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.loadProducts());
  }

  loadCategories(): void {
    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.categories = data,
        error: (err) => console.error('Error cargando categorías', err)
      });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAll(this.selectedCategoryId, this.searchText || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.products = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error cargando productos', err);
          this.isLoading = false;
        }
      });
  }

  onSearchChange(value: string): void {
    this.searchText = value;
    this.searchSubject.next(value);
  }

  selectCategory(categoryId?: number): void {
    this.selectedCategoryId = categoryId;
    this.loadProducts();
  }

  get activeCategoryName(): string {
    return this.categories.find(c => c.id === this.selectedCategoryId)?.name ?? '';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}