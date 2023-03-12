/* eslint-disable */
//@ts-nocheck

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Pricing, PricingDocument } from './schemas/pricing.schema';
import * as SSLCommerz from "ssl-commerz-node";
const PaymentSession = SSLCommerz.PaymentSession;
import shortid from "shortid-fix";




@Injectable()
export class PaymentsService {

  constructor(
    @InjectModel(Pricing.name) private pricingModel: Model<PricingDocument>
  ) {
    this.payment = new PaymentSession(
      true,
      process.env.SSLCOMMERZ_STORE_ID,
      process.env.SSLCOMMERZ_STORE_PASSWORD
    );
  }

  payment = null

  async SSLCommerz_payment_init(paymentDto: CreatePaymentDto) {
    // return new this.pricingModel(paymentDto).save();
    const { price } = paymentDto;
    const transactionId = `transaction_${shortid.generate()}`;

    if (!(price > '0')) {
      return 'All FIeld Must be required'
    }
    else {
      try {

        // Set the urls
        this.payment.setUrls({
          // success: "yoursite.com/success", // If payment Succeed
          success: `${process.env.SERVER_URL}/payments/checkout/success?transactionId=${transactionId}`, // If payment Succeed
          fail: `${process.env.SERVER_URL}payments/checkout/fail`, // If payment failed
          cancel: `${process.env.SERVER_URL}payments/checkout/cancel`, // If user cancel payment
          ipn: `${process.env.SERVER_URL}/ipn`, // SSLCommerz will send http post request in this link
        });
        // Set order details
        this.payment.setOrderInfo({
          total_amount: price, // Number field
          currency: "BDT", // Must be three character string
          tran_id: transactionId, // Unique Transaction id
          emi_option: 0, // 1 or 0
          multi_card_name: "internetbank", // Do not Use! If you do not customize the gateway list,
          allowed_bin: "371598,371599,376947,376948,376949", // Do not Use! If you do not control on transaction
          emi_max_inst_option: 3, // Max instalment Option
          emi_allow_only: 0, // Value is 1/0, if value is 1 then only EMI transaction is possible
        });
        // Set customer info
        // const { cusName, cusEmail, cusAdd1, cusAdd2, cusCity, cusState, cusPostcode, cusCountry, cusPhone, cusFax } = customerInfo;
        this.payment.setCusInfo({
          name: "Simanta Paul",
          email: "simanta@bohubrihi.com",
          add1: "66/A Midtown",
          add2: "Andarkilla",
          city: "Chittagong",
          state: "Optional",
          postcode: 4000,
          country: "Bangladesh",
          phone: "010000000000",
          fax: "Customer_fax_id",
        });

        // Set shipping info
        // const { name, shippingAdd1, shippingAdd2, shippingCity, shippingState, shippingPostcode, shippingCountry } = shippingInfo;
        // Set shipping info
        this.payment.setShippingInfo({
          method: "Courier", //Shipping method of the order. Example: YES or NO or Courier
          num_item: 2,
          name: "Simanta Paul",
          add1: "66/A Midtown",
          add2: "Andarkilla",
          city: "Chittagong",
          state: "Optional",
          postcode: 4000,
          country: "Bangladesh",
        });

        // Set Product Profile
        // payment.setProductInfo({
        //   product_name: cartItems.map(i => i.productName).join(', '),
        //   product_category: "Electronics",
        //   product_profile: "general",
        // });

        // Set Product Profile
        this.payment.setProductInfo({
          product_name: "Computer",
          product_category: "Electronics",
          product_profile: "general",
        });

        const res = await this.payment.paymentInit();
        // console.log(res);
        return res;
        // Initiate Payment and Get session key
        // this.payment.paymentInit().then(async (response) => {
        // // console.log(response);
        // // console.log(response.GatewayPageURL);
        // return response.GatewayPageURL;
        // return await response["GatewayPageURL"]
        // res.send(response["GatewayPageURL"]);

        // paymentDone = response["status"] === "SUCCESS";

        // const newOrder = new Order({
        //   _id: transactionId,
        //   cartItems: cartItems.map(item => {
        //     return {
        //       ...item, productImage: process.env.CLIENT_URL + item.productImage,
        //     }
        //   }),
        //   totalAmount,
        //   deliveryMethod,
        //   numItem,
        //   customerInfo,
        //   shippingInfo,
        //   transactionId,
        // paymentDone,
        // });
      }
      catch {
        return "ERROR 404"
      }
    }
  }

  async SSLCommerz_payment_success(createPaymentDto: CreatePaymentDto) {

  }

  async SSLCommerz_payment_fail(createPaymentDto: CreatePaymentDto) {

  }

  async SSLCommerz_payment_cancel(createPaymentDto: CreatePaymentDto) {

  }

  // exports.SSLCommerz_payment_success = async (req, res) => {
  //     const { transactionId } = req.query;

  //     if (!transactionId) {
  //       return res.json({ message: "transactionId must be required" });
  //     } else {
  //       const currentOrder = Order.findByIdAndUpdate(transactionId, {
  //         paymentDone: true,
  //         updatedAt: Date.now(),
  //       });

  //       currentOrder.exec((err, result) => {
  //         if (err) // console.log(err);
  //         res.redirect(`${process.env.CLIENT_URL}/checkout/success/${transactionId}`)
  //       });
  //     }
  //   };

  // exports.SSLCommerz_payment_fail = (req, res) => {
  //     res.redirect(`${process.env.CLIENT_URL}/checkout/fail`);
  //   };

  // exports.SSLCommerz_payment_cancel = (req, res) => {
  //     res.redirect(`${process.env.CLIENT_URL}/checkout/cancel`);
  //   };


  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }

}
