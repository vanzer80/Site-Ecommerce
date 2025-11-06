
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe]
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  // FIX: Explicitly cast injected Router to its type to resolve a potential type inference issue where it is treated as 'unknown'.
  private router = inject(Router) as Router;
  cartService = inject(CartService);

  checkoutForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    document: ['', Validators.required],
    cep: ['', Validators.required],
    street: ['', Validators.required],
    number: ['', Validators.required],
    neighborhood: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    observations: [''],
  });

  constructor() {
    if (this.cartService.items().length === 0) {
      this.router.navigate(['/']);
    }
  }

  sendToWhatsApp() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const formData = this.checkoutForm.value;
    const items = this.cartService.items();
    const total = this.cartService.totalPrice();

    let orderText = `🛒 *NOVO PEDIDO* 🛒\n\n`;
    orderText += `*Cliente:*\n`;
    orderText += `Nome: ${formData.fullName}\n`;
    orderText += `Tel: ${formData.phone}\n`;
    orderText += `Endereço: ${formData.street}, ${formData.number}, ${formData.neighborhood}, ${formData.city}-${formData.state}\n\n`;
    
    orderText += `*Produtos:*\n`;
    items.forEach(item => {
      orderText += `(${item.quantity}x) ${item.product.name} - ${item.product.brand}\n`;
    });

    orderText += `\n💰 *TOTAL: R$ ${total.toFixed(2)}*\n\n`;
    
    if (formData.observations) {
      orderText += `*Observações:* ${formData.observations}`;
    }

    const whatsappUrl = `https://wa.me/5511999998888?text=${encodeURIComponent(orderText)}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart and navigate to a thank you page or home
    this.cartService.clearCart();
    this.router.navigate(['/']); 
  }

  isInvalid(fieldName: string): boolean {
    const control = this.checkoutForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
