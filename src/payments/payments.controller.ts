import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  // eslint-disable-next-line no-empty-function
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }


  @Post("/checkout")
  payment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.SSLCommerz_payment_init(createPaymentDto);
  }

  @Post("/checkout/success")
  paymentSuccess(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.SSLCommerz_payment_success(createPaymentDto);
  }

  @Post("/checkout/fail")
  paymentFail(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.SSLCommerz_payment_fail(createPaymentDto);
  }

  @Post("/checkout/cancel")
  paymentCancel(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.SSLCommerz_payment_cancel(createPaymentDto);
  }


}
