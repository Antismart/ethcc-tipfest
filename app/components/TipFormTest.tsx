"use client";

import { Card, Button, Icon } from "./DemoComponents";

export function TipFormTest() {
  return (
    <Card className="p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">
          Test Component
        </h2>
        <Button>Test Button</Button>
        <Icon name="check" size="sm" />
      </div>
    </Card>
  );
}
