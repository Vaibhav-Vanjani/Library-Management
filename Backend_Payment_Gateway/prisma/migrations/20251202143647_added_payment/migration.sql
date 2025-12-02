-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "razorpay_payment_id" TEXT NOT NULL,
    "razorpay_order_id" TEXT NOT NULL,
    "razorpay_signature" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "payment" TEXT NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);
