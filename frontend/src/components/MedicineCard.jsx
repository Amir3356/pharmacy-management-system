import { Button } from './ui/button'
import { Card } from './ui/card'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function getStockBadge(quantity) {
  const amount = Number(quantity) || 0

  if (amount === 0) {
    return { label: 'Out of stock', tone: 'danger' }
  }

  if (amount <= 10) {
    return { label: 'Low stock', tone: 'warning' }
  }

  return { label: 'In stock', tone: 'success' }
}

export default function MedicineCard({ medicine, onEdit, onDelete }) {
  const stockBadge = getStockBadge(medicine.quantity)
  const expiryDate = new Date(medicine.expiry_date)
  const expiryLabel = Number.isNaN(expiryDate.getTime())
    ? medicine.expiry_date
    : expiryDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })

  return (
    <Card className="medicine-card">
      <header>
        <div>
          <h3>{medicine.name}</h3>
          <div className="tag-row">
            <span className="tag">{medicine.category}</span>
            <span className={`badge ${stockBadge.tone}`}>{stockBadge.label}</span>
          </div>
        </div>
        <strong style={{ color: 'var(--primary-strong)' }}>{currencyFormatter.format(Number(medicine.price) || 0)}</strong>
      </header>

      <div className="meta-row">
        <span className="tag">Quantity: {medicine.quantity}</span>
        <span className="tag">Expiry: {expiryLabel}</span>
      </div>

      <p className="muted">{medicine.description || 'No description provided.'}</p>

      <div className="inline-actions">
        <Button variant="secondary" type="button" onClick={() => onEdit(medicine)}>
          Edit
        </Button>
        <Button variant="destructive" type="button" onClick={() => onDelete(medicine)}>
          Delete
        </Button>
      </div>
    </Card>
  )
}