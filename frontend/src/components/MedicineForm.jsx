import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

const emptyForm = {
  name: '',
  category: '',
  price: '',
  quantity: '',
  expiry_date: '',
  description: '',
}

export default function MedicineForm({
  initialValues = emptyForm,
  submitLabel = 'Save medicine',
  onSubmit,
  busy = false,
}) {
  const [formData, setFormData] = useState({ ...emptyForm, ...initialValues })

  const updateField = (field) => (event) => {
    setFormData((currentValues) => ({
      ...currentValues,
      [field]: event.target.value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(formData)
  }

  return (
    <form className="medicine-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={formData.name} onChange={updateField('name')} required />
        </div>

        <div className="form-field">
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={formData.category} onChange={updateField('category')} required />
        </div>

        <div className="form-field">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={updateField('price')}
            required
          />
        </div>

        <div className="form-field">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            step="1"
            value={formData.quantity}
            onChange={updateField('quantity')}
            required
          />
        </div>

        <div className="form-field">
          <Label htmlFor="expiry-date">Expiry date</Label>
          <Input id="expiry-date" type="date" value={formData.expiry_date} onChange={updateField('expiry_date')} required />
        </div>

        <div className="form-field">
          <span className="form-help">All fields are required except description.</span>
        </div>
      </div>

      <div className="form-field">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows="5"
          value={formData.description}
          onChange={updateField('description')}
          placeholder="Add notes for the medicine stock"
        />
      </div>

      <div className="form-footer">
        <p className="form-help">Keep the quantity updated so stock alerts stay accurate.</p>
        <Button type="submit" disabled={busy}>
          {busy ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}