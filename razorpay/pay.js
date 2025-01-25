import razorpayInstance from "./razorpay.js";

export async function createPaymentLink(chatId) {
  try {
    const paymentLinkOptions = {
      amount: 10 * 100,
      currency: "INR",
      description: "Static Payment of ₹10",
    };

    const paymentLink = await razorpayInstance.paymentLink.create(
      paymentLinkOptions
    );
    
    return paymentLink;
  } catch (error) {
    throw new Error(`Failed to create payment link: ${error.message}`);
  }
}

export async function getPaymentStatus(paymentId) {
  try {
    console.log(paymentId)
    const paymentDetails = await razorpayInstance.paymentLink.fetch(paymentId);
    return paymentDetails.status;
  } catch (error) {
    throw new Error(`Failed to fetch payment status`);
  }
}
