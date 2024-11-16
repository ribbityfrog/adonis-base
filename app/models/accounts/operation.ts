import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import withDefaultFields from '#models/mixins/default_fields'

export default class Operation extends compose(BaseModel, withDefaultFields) {}
