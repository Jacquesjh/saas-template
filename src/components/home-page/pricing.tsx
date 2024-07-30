"use client";

import {useState} from "react";
import {cn} from "@/lib/utils";

import {CheckCircle2} from "lucide-react";
import {StripePlanProps} from "@/types";
import config from "@/config";
import ButtonCheckout from "../button-checkout";
import {Container, Section} from "../craft";
import {Button} from "../ui/button";
import {Badge} from "../ui/badge";

export interface PricingTierFrequency {
  id: string;
  value: string;
  label: string;
  priceSuffix: string;
}

export const frequencies: PricingTierFrequency[] = [
  {id: "1", value: "1", label: "Monthly", priceSuffix: "/month"},
  {id: "2", value: "2", label: "Yearly", priceSuffix: "/year"},
];

export default function Pricing() {
  const [frequency, setFrequency] = useState(frequencies[0]);

  const plans = config.stripe.plans;

  return (
    <Section className="px-4">
      <Container className="flex flex-col items-center gap-6 p-6 md:rounded-xl md:p-12">
        <div className="w-full lg:w-auto mx-auto max-w-4xl lg:text-center">
          <h1 className="text-black dark:text-white text-4xl font-semibold max-w-xs sm:max-w-none md:text-6xl !leading-tight">
            Pricing
          </h1>
          <p className="text-black dark:text-white mt-6 md:text-xl lg:text-center max-w-prose">
            It fits your needs. Whatever they are
          </p>
        </div>

        {frequencies.length > 1 && (
          <div className="mt-16 flex justify-center">
            <div className="flex flex-row gap-2 bg-muted p-1 rounded-lg">
              {frequencies.map((f) => (
                <Button
                  key={f.id}
                  variant={
                    f.label === frequency.label ? "outline" : "secondary"
                  }
                  className="border-0 w-36 font-semibold"
                  onClick={() => setFrequency(f)}>
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div
          className={cn(
            "isolate mx-auto mt-4 mb-28 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none",
            plans.length === 2 ? "lg:grid-cols-2" : "",
            plans.length === 3 ? "lg:grid-cols-3" : ""
          )}>
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              frequency={frequency.label.toLocaleLowerCase()}
              plan={plan}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

interface Props {
  frequency: string;
  plan: StripePlanProps;
}
function PricingCard(props: Props) {
  const {frequency, plan} = props;
  const frequencyPriceId =
    plan.priceIds.find((priceId) => priceId.frequency === frequency)?.priceId ||
    plan.priceIds[0].priceId;

  const frequencyPrice =
    plan.prices.find((priceId) => priceId.frequency === frequency)?.price ||
    plan.prices[0].price;

  return (
    <div
      key={frequencyPriceId}
      className={cn(
        plan.isFeatured
          ? "bg-accent-foreground ring-accent-foreground dark:bg-accent dark:ring-accent"
          : "ring-accent bg-accent/25",
        "max-w-xs ring-1 rounded-lg p-8 xl:p-10 flex flex-col gap-4"
      )}>
      {plan.isFeatured && (
        <span className="absolute font-bold text-primary text-[8px] md:text-xs tracking-tight bg-primary/20 py-0.5 px-2 md:py-0.5 md:px-3 rounded-full border-primary/20 border-2 w-fit">
          Popular
        </span>
      )}

      {/* Title */}
      <h3
        id={frequencyPriceId}
        className={cn(
          plan.isFeatured
            ? "text-accent dark:text-accent-foreground"
            : "text-accent-foreground",
          "text-2xl font-bold tracking-tight"
        )}>
        {plan.name}
      </h3>

      {/* Description */}
      <p
        className={cn(
          plan.isFeatured
            ? "text-muted dark:text-muted-foreground"
            : "text-muted-foreground",
          "mt-4 text-sm leading-6 md:h-24"
        )}>
        {plan.description}
      </p>

      {/* Price */}
      <p
        className={cn(
          plan.isFeatured
            ? "text-accent dark:text-accent-foreground"
            : "text-accent-foreground",
          "mt-6 flex items-baseline gap-x-2"
        )}>
        <span className="text-4xl font-bold tracking-tight">
          {`$${frequencyPrice}`}
        </span>

        <span>{plan.isRecurrent ? `/${frequency}` : "one time"}</span>
      </p>

      {/* CTA Button */}
      <ButtonCheckout priceId={frequencyPriceId} text={plan.ctaText} />

      {/* Features */}
      <div
        className={cn(
          plan.isFeatured
            ? "text-muted dark:text-muted-foreground"
            : "text-muted-foreground",
          "text-sm leading-6 mt-6 xl:mt-10 flex flex-col justify-start"
        )}>
        {plan.features.map((feature) => (
          <li key={feature.name} className="flex flex-row gap-x-3">
            <CheckCircle2
              className={cn(
                plan.isFeatured && "text-primary ",
                "h-6 w-5 flex-none"
              )}
              aria-hidden="true"
            />

            {feature.name}
          </li>
        ))}
      </div>
    </div>
  );
}
