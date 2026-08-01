import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatCurrency, discountedPrice } from '@/utils/format';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import PageHeader from '@/components/PageHeader';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [placing, setPlacing] = useState(false);
  const [shipping, setShipping] = useState({
    full_name: profile?.full_name || '',
    address: profile?.address?.street || '',
    city: profile?.address?.city || '',
    state: profile?.address?.state || '',
    zip: profile?.address?.zip || '',
    country: profile?.address?.country || 'United States',
    phone: profile?.phone || '',
  });
  const [payment, setPayment] = useState({ method: 'card', card_number: '', card_name: '', expiry: '', cvv: '' });
  const [notes, setNotes] = useState('');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const shippingFee = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shippingFee + tax;

  async function placeOrder() {
    if (!user) return;
    setPlacing(true);
    try {
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        user_id: user.id,
        status: 'pending',
        subtotal: totalPrice,
        discount_amount: 0,
        shipping_fee: shippingFee,
        total: grandTotal,
        shipping_address: shipping,
        payment_method: payment.method,
        payment_status: 'pending',
        notes,
      }).select().single();
      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        book_id: item.book_id,
        quantity: item.quantity,
        unit_price: discountedPrice(item.books!.price, item.books!.discount),
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  }

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: CheckCircle2 },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Checkout" />
      {/* Stepper */}
      <div className="mb-8 flex items-center justify-center">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className={`flex flex-col items-center ${step === s.id ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${step === s.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className="mt-1 text-xs font-medium">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`mx-2 h-0.5 w-12 sm:w-20 ${step === steps[i + 1].id || steps.findIndex(x => x.id === step) > i ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`} />}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === 'shipping' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Shipping Address</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input label="Full Name" value={shipping.full_name} onChange={e => setShipping(s => ({ ...s, full_name: e.target.value }))} className="sm:col-span-2" />
                <Input label="Street Address" value={shipping.address} onChange={e => setShipping(s => ({ ...s, address: e.target.value }))} className="sm:col-span-2" />
                <Input label="City" value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} />
                <Input label="State / Province" value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} />
                <Input label="ZIP / Postal Code" value={shipping.zip} onChange={e => setShipping(s => ({ ...s, zip: e.target.value }))} />
                <Input label="Country" value={shipping.country} onChange={e => setShipping(s => ({ ...s, country: e.target.value }))} />
                <Input label="Phone" value={shipping.phone} onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))} className="sm:col-span-2" />
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setStep('payment')}>Continue to Payment</Button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Payment Method</h2>
              <div className="mt-4 space-y-3">
                {['card', 'paypal', 'cod'].map(method => (
                  <label key={method} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${payment.method === method ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                    <input type="radio" checked={payment.method === method} onChange={() => setPayment(p => ({ ...p, method }))} className="text-indigo-600 focus:ring-indigo-500" />
                    <span className="font-medium capitalize text-slate-900 dark:text-white">{method === 'cod' ? 'Cash on Delivery' : method}</span>
                  </label>
                ))}
              </div>
              {payment.method === 'card' && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Input label="Card Number" placeholder="1234 5678 9012 3456" value={payment.card_number} onChange={e => setPayment(p => ({ ...p, card_number: e.target.value }))} className="sm:col-span-2" />
                  <Input label="Name on Card" value={payment.card_name} onChange={e => setPayment(p => ({ ...p, card_name: e.target.value }))} className="sm:col-span-2" />
                  <Input label="Expiry" placeholder="MM/YY" value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))} />
                  <Input label="CVV" placeholder="123" value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))} />
                </div>
              )}
              <Textarea label="Order Notes (optional)" rows={2} value={notes} onChange={e => setNotes(e.target.value)} className="mt-4" />
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep('shipping')}><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={() => setStep('review')}>Review Order</Button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Review Your Order</h2>
              <div className="mt-4 space-y-4">
                {items.map(item => {
                  const book = item.books!;
                  const price = discountedPrice(book.price, book.discount);
                  return (
                    <div key={item.id} className="flex items-center gap-4 border-b border-slate-100 pb-4 dark:border-slate-700">
                      <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-slate-100 dark:bg-slate-900">
                        {book.image_url && <img src={book.image_url} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">{book.title}</p>
                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(price * item.quantity)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep('payment')}><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={placeOrder} loading={placing} size="lg">Place Order — {formatCurrency(grandTotal)}</Button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Order Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd className="font-medium text-slate-900 dark:text-white">{formatCurrency(totalPrice)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Shipping</dt><dd className="font-medium text-slate-900 dark:text-white">{shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Tax (8%)</dt><dd className="font-medium text-slate-900 dark:text-white">{formatCurrency(tax)}</dd></div>
              <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
                <div className="flex justify-between"><dt className="font-semibold text-slate-900 dark:text-white">Total</dt><dd className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(grandTotal)}</dd></div>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
