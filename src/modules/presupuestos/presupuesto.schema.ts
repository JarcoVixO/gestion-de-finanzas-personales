import type { CreatePresupuestoPayload, DomainIdentifier, UpdatePresupuestoPayload } from '../../shared/types/domain'
import type { ValidationResult } from '../../shared/types/http'

const isValidDateFormat = (date: string): boolean => {
  if (!date || typeof date !== 'string') return false
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
}

const isValidDate = (dateStr: string): boolean => {
  if (!isValidDateFormat(dateStr)) return false
  const date = new Date(`${dateStr}T00:00:00`)
  return !Number.isNaN(date.getTime())
}

const validateDateRange = (fechaInicio: string, fechaFin: string | null | undefined): boolean => {
  if (!fechaFin) return true
  if (!isValidDate(fechaFin)) return false
  return fechaFin >= fechaInicio
}

export function validatePresupuestoId(id: DomainIdentifier): ValidationResult<DomainIdentifier> {
  if (!id || (typeof id !== 'string' && typeof id !== 'number')) {
    return { success: false, errors: ['El ID del presupuesto es requerido.'] }
  }
  return { success: true, data: id }
}

export function validateCreatePresupuesto(payload: unknown): ValidationResult<CreatePresupuestoPayload> {
  const errors: string[] = []

  if (!payload || typeof payload !== 'object') {
    return { success: false, errors: ['El payload debe ser un objeto.'] }
  }

  const p = payload as Record<string, unknown>

  // Validar nombre
  const nombre = String(p.nombre || '').trim()
  if (!nombre) {
    errors.push('El nombre del presupuesto es requerido.')
  }

  // Validar monto_limite
  const montoLimite = Number(p.monto_limite || 0)
  if (!Number.isFinite(montoLimite) || montoLimite <= 0) {
    errors.push('El monto límite debe ser un número mayor a 0.')
  }

  // Validar fecha_inicio
  const fechaInicio = String(p.fecha_inicio || '').trim()
  if (!fechaInicio) {
    errors.push('La fecha de inicio es requerida.')
  } else if (!isValidDate(fechaInicio)) {
    errors.push('La fecha de inicio debe estar en formato YYYY-MM-DD.')
  }

  // Validar fecha_fin 
  const fechaFin = p.fecha_fin ? String(p.fecha_fin).trim() : null
  if (fechaFin && !isValidDate(fechaFin)) {
    errors.push('La fecha de fin debe estar en formato YYYY-MM-DD.')
  }

  // Validar que fecha_fin >= fecha_inicio
  if (fechaInicio && !validateDateRange(fechaInicio, fechaFin)) {
    errors.push('La fecha de fin no puede ser anterior a la fecha de inicio.')
  }

  if (errors.length > 0) {
    return { success: false, errors }
  }

  return {
    success: true,
    data: {
      nombre,
      monto_limite: montoLimite,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    }
  }
}

export function validateUpdatePresupuesto(payload: unknown): ValidationResult<UpdatePresupuestoPayload> {
  const errors: string[] = []

  if (!payload || typeof payload !== 'object') {
    return { success: false, errors: ['El payload debe ser un objeto.'] }
  }

  const p = payload as Record<string, unknown>
  const result: UpdatePresupuestoPayload = {}

  // Validar nombre 
  if (p.nombre !== undefined) {
    const nombre = String(p.nombre || '').trim()
    if (!nombre) {
      errors.push('El nombre del presupuesto no puede estar vacío.')
    } else {
      result.nombre = nombre
    }
  }

  // Validar monto_limite 
  if (p.monto_limite !== undefined) {
    const montoLimite = Number(p.monto_limite || 0)
    if (!Number.isFinite(montoLimite) || montoLimite <= 0) {
      errors.push('El monto límite debe ser un número mayor a 0.')
    } else {
      result.monto_limite = montoLimite
    }
  }

  // Validar fecha_inicio 
  if (p.fecha_inicio !== undefined) {
    const fechaInicio = String(p.fecha_inicio || '').trim()
    if (!fechaInicio) {
      errors.push('La fecha de inicio no puede estar vacía.')
    } else if (!isValidDate(fechaInicio)) {
      errors.push('La fecha de inicio debe estar en formato YYYY-MM-DD.')
    } else {
      result.fecha_inicio = fechaInicio
    }
  }

  // Validar fecha_fin 
  if (p.fecha_fin !== undefined) {
    const fechaFin = p.fecha_fin ? String(p.fecha_fin).trim() : null
    if (fechaFin && !isValidDate(fechaFin)) {
      errors.push('La fecha de fin debe estar en formato YYYY-MM-DD.')
    } else {
      result.fecha_fin = fechaFin
    }
  }

  // Validar que fecha_fin >= fecha_inicio si ambas están presentes o se están actualizando
  const hasDateRangeChange = p.fecha_inicio !== undefined || p.fecha_fin !== undefined
  if (hasDateRangeChange) {
    const fechaInicio = result.fecha_inicio !== undefined ? result.fecha_inicio : (p.fecha_inicio as string)
    const fechaFin = result.fecha_fin !== undefined ? result.fecha_fin : (typeof p.fecha_fin === 'string' ? p.fecha_fin : null)

    if (fechaInicio && !validateDateRange(fechaInicio, fechaFin)) {
      errors.push('La fecha de fin no puede ser anterior a la fecha de inicio.')
    }
  }

  if (errors.length > 0) {
    return { success: false, errors }
  }

  return { success: true, data: result }
}