/*
  Warnings:

  - You are about to drop the column `cookieConsentAccepted` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `marketingConsentAccepted` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `privacyPolicyAccepted` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `tosAccepted` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auth"."user" DROP COLUMN "cookieConsentAccepted",
DROP COLUMN "marketingConsentAccepted",
DROP COLUMN "privacyPolicyAccepted",
DROP COLUMN "tosAccepted";
