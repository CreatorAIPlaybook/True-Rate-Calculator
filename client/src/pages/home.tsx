import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Clock, 
  RefreshCw, 
  Receipt, 
  Percent, 
  Target,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Calculator,
  Zap,
  Search,
  CreditCard,
  Users
} from "lucide-react";

type ScenarioMode = "quick" | "deep";

interface DealInputs {
  dealAmount: number;
  estimatedHours: number;
  revisions: number;
  expenses: number;
  taxRate: number;
  softwareCosts: number;
  agencyFees: number;
}

interface Calculations {
  netRevenue: number;
  totalHours: number;
  effectiveRate: number;
  isApproved: boolean;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrencyWithCents(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function Home() {
  const [scenarioMode, setScenarioMode] = useState<ScenarioMode>("quick");
  const [minimumFloor, setMinimumFloor] = useState(100);
  const [inputs, setInputs] = useState<DealInputs>({
    dealAmount: 5000,
    estimatedHours: 10,
    revisions: 0,
    expenses: 0,
    taxRate: 30,
    softwareCosts: 0,
    agencyFees: 0,
  });

  const calculations = useMemo<Calculations>(() => {
    const totalExpenses = inputs.expenses + 
      (scenarioMode === "deep" ? inputs.softwareCosts + inputs.agencyFees : 0);
    const taxAmount = inputs.dealAmount * (inputs.taxRate / 100);
    const netRevenue = inputs.dealAmount - totalExpenses - taxAmount;
    const totalHours = inputs.estimatedHours + (inputs.revisions * 2);
    const effectiveRate = totalHours > 0 ? netRevenue / totalHours : 0;
    const isApproved = effectiveRate >= minimumFloor;

    return { netRevenue, totalHours, effectiveRate, isApproved };
  }, [inputs, minimumFloor, scenarioMode]);

  const updateInput = (field: keyof DealInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: keyof DealInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateInput(field, value);
  };

  const handleModeChange = (mode: ScenarioMode) => {
    setScenarioMode(mode);
    if (mode === "quick") {
      setInputs(prev => ({ ...prev, softwareCosts: 0, agencyFees: 0 }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900" data-testid="text-app-title">
              Deal Margin Simulator
            </h1>
            <p className="text-xs text-slate-500">Know your true hourly rate</p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 pb-48 md:pb-52">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
            <button
              onClick={() => handleModeChange("quick")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                scenarioMode === "quick"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              data-testid="button-quick-check"
            >
              <Zap className="w-4 h-4" />
              Quick Check
            </button>
            <button
              onClick={() => handleModeChange("deep")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                scenarioMode === "deep"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              data-testid="button-deep-dive"
            >
              <Search className="w-4 h-4" />
              Deep Dive
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600">
                  <Receipt className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">The Deal</h2>
              </div>

              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="dealAmount" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    Deal Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <Input
                      id="dealAmount"
                      type="number"
                      value={inputs.dealAmount || ""}
                      onChange={handleInputChange("dealAmount")}
                      className="pl-8 h-11 rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5000"
                      data-testid="input-deal-amount"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedHours" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Estimated Hours
                    </Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      value={inputs.estimatedHours || ""}
                      onChange={handleInputChange("estimatedHours")}
                      className="h-11 rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10"
                      data-testid="input-estimated-hours"
                    />
                    <p className="text-xs text-slate-400">Filming, editing, admin</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revisions" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-slate-400" />
                      Revisions
                    </Label>
                    <Input
                      id="revisions"
                      type="number"
                      value={inputs.revisions || ""}
                      onChange={handleInputChange("revisions")}
                      className="h-11 rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                      data-testid="input-revisions"
                    />
                    <p className="text-xs text-slate-400">+2 hours each</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expenses" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      Expenses
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                      <Input
                        id="expenses"
                        type="number"
                        value={inputs.expenses || ""}
                        onChange={handleInputChange("expenses")}
                        className="pl-8 h-11 rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                        data-testid="input-expenses"
                      />
                    </div>
                    <p className="text-xs text-slate-400">Props, contractors</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxRate" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Percent className="w-4 h-4 text-slate-400" />
                      Tax Rate
                    </Label>
                    <div className="relative">
                      <Input
                        id="taxRate"
                        type="number"
                        value={inputs.taxRate || ""}
                        onChange={handleInputChange("taxRate")}
                        className="pr-8 h-11 rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="30"
                        min="0"
                        max="100"
                        data-testid="input-tax-rate"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                    </div>
                  </div>
                </div>

                {scenarioMode === "deep" && (
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                        Deep Dive
                      </Badge>
                      <span className="text-xs text-slate-400">Additional costs</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="softwareCosts" className="text-sm font-medium text-slate-700">
                          Software Subscriptions
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                          <Input
                            id="softwareCosts"
                            type="number"
                            value={inputs.softwareCosts || ""}
                            onChange={handleInputChange("softwareCosts")}
                            className="pl-8 h-11 rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0"
                            data-testid="input-software-costs"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="agencyFees" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          Agency Fees
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                          <Input
                            id="agencyFees"
                            type="number"
                            value={inputs.agencyFees || ""}
                            onChange={handleInputChange("agencyFees")}
                            className="pl-8 h-11 rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0"
                            data-testid="input-agency-fees"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-600">
                  <Target className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Your Standards</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-700">
                    Minimum Hourly Floor
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-slate-900" data-testid="text-minimum-floor">
                      {formatCurrency(minimumFloor)}
                    </span>
                    <span className="text-sm text-slate-400">/hr</span>
                  </div>
                </div>

                <Slider
                  value={[minimumFloor]}
                  onValueChange={(value) => setMinimumFloor(value[0])}
                  min={25}
                  max={500}
                  step={5}
                  className="py-2"
                  data-testid="slider-minimum-floor"
                />

                <div className="flex justify-between text-xs text-slate-400">
                  <span>$25/hr</span>
                  <span>$500/hr</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-lg z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Card 
            className={`rounded-xl border-2 transition-all duration-300 overflow-visible ${
              calculations.isApproved 
                ? "bg-emerald-50 border-emerald-200" 
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    calculations.isApproved 
                      ? "bg-emerald-100 text-emerald-600" 
                      : "bg-red-100 text-red-600"
                  }`}>
                    {calculations.isApproved 
                      ? <CheckCircle2 className="w-6 h-6" />
                      : <XCircle className="w-6 h-6" />
                    }
                  </div>
                  <div>
                    <p className={`text-xs font-medium uppercase tracking-wide ${
                      calculations.isApproved ? "text-emerald-600" : "text-red-600"
                    }`}>
                      Effective Hourly Rate
                    </p>
                    <p className={`text-3xl md:text-4xl font-bold ${
                      calculations.isApproved ? "text-emerald-700" : "text-red-700"
                    }`} data-testid="text-effective-rate">
                      {formatCurrencyWithCents(calculations.effectiveRate)}
                      <span className="text-lg font-normal opacity-70">/hr</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Badge 
                    className={`justify-center py-1.5 px-4 text-sm font-semibold ${
                      calculations.isApproved 
                        ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                    data-testid="badge-deal-status"
                  >
                    {calculations.isApproved ? "DEAL APPROVED" : "REJECT DEAL"}
                  </Badge>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    data-testid="button-lock-deal"
                    asChild
                  >
                    <a href="#">
                      Lock in this deal with a contract
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/50 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-slate-500">Net Revenue</p>
                  <p className="text-sm font-semibold text-slate-700" data-testid="text-net-revenue">
                    {formatCurrency(calculations.netRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Hours</p>
                  <p className="text-sm font-semibold text-slate-700" data-testid="text-total-hours">
                    {calculations.totalHours}h
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Your Floor</p>
                  <p className="text-sm font-semibold text-slate-700" data-testid="text-floor-comparison">
                    {formatCurrency(minimumFloor)}/hr
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 -z-10 pb-2 text-center">
        <p className="text-xs text-slate-400" data-testid="text-footer">
          Built by Playbook Media
        </p>
      </footer>
    </div>
  );
}
