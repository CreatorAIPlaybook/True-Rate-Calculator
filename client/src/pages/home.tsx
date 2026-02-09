import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
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
  CreditCard,
  Users,
  Lock,
  Info,
  Copy,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";

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

interface StoredState {
  showAdvancedCosts: boolean;
  minimumFloor: number;
  inputs: DealInputs;
}

const STORAGE_KEY = "true-rate-calculator-state";

const defaultInputs: DealInputs = {
  dealAmount: 5000,
  estimatedHours: 10,
  revisions: 0,
  expenses: 0,
  taxRate: 30,
  softwareCosts: 0,
  agencyFees: 0,
};

function loadStoredState(): StoredState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if ("scenarioMode" in parsed) {
        parsed.showAdvancedCosts = parsed.scenarioMode === "deep";
        delete parsed.scenarioMode;
      }
      return parsed;
    }
  } catch (e) {
    console.error("Failed to load stored state:", e);
  }
  return null;
}

function saveState(state: StoredState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state:", e);
  }
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

function InfoTooltip({ content }: { content: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          type="button" 
          className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/10 text-gray-400 hover:bg-white/20 transition-colors"
          data-testid="button-info-tooltip"
        >
          <Info className="w-3 h-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" className="max-w-xs text-sm p-3">
        {content}
      </PopoverContent>
    </Popover>
  );
}

export default function Home() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const storedState = loadStoredState();
  const [showAdvancedCosts, setShowAdvancedCosts] = useState(storedState?.showAdvancedCosts || false);
  const [minimumFloor, setMinimumFloor] = useState(storedState?.minimumFloor || 100);
  const [inputs, setInputs] = useState<DealInputs>(storedState?.inputs || defaultInputs);

  useEffect(() => {
    saveState({ showAdvancedCosts, minimumFloor, inputs });
  }, [showAdvancedCosts, minimumFloor, inputs]);

  const calculations = useMemo<Calculations>(() => {
    const totalExpenses = inputs.expenses + 
      (showAdvancedCosts ? inputs.softwareCosts + inputs.agencyFees : 0);
    const taxAmount = inputs.dealAmount * (inputs.taxRate / 100);
    const netRevenue = inputs.dealAmount - totalExpenses - taxAmount;
    const totalHours = inputs.estimatedHours + (inputs.revisions * 2);
    const effectiveRate = totalHours > 0 ? netRevenue / totalHours : 0;
    const isApproved = effectiveRate >= minimumFloor;

    return { netRevenue, totalHours, effectiveRate, isApproved };
  }, [inputs, minimumFloor, showAdvancedCosts]);

  const updateInput = (field: keyof DealInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: keyof DealInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateInput(field, value);
  };

  const toggleAdvancedCosts = () => {
    setShowAdvancedCosts(prev => {
      if (prev) {
        setInputs(current => ({ ...current, softwareCosts: 0, agencyFees: 0 }));
      }
      return !prev;
    });
  };

  const handleCopySummary = async () => {
    const verdict = calculations.isApproved ? "GREEN LIGHT: Good Deal" : "RED FLAG: Negotiate Higher";
    const summary = `Deal Summary
─────────────────
Gross Deal: ${formatCurrency(inputs.dealAmount)}
Net Revenue: ${formatCurrency(calculations.netRevenue)}
Total Hours: ${calculations.totalHours}h
Effective Rate: ${formatCurrencyWithCents(calculations.effectiveRate)}/hr
Your Floor: ${formatCurrency(minimumFloor)}/hr

Verdict: ${verdict}

─────────────────
Calculated with True Rate Calculator
creatoraiplaybook.co`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Deal summary copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] flex flex-col">
      <header className="w-full bg-[#0F1115] pt-6 pb-4">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <Lock className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-sm text-gray-500" data-testid="text-privacy-notice">
              100% Private - Stored Only on Your Device
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2" data-testid="text-app-title">
              True Rate Calculator
            </h1>
            <p className="text-sm text-gray-400">Calculate your effective hourly rate on sponsorship deals</p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 pb-40">
        <div className="space-y-6">
          <Card className="bg-[#161B22] rounded-xl border border-white/10 shadow-none overflow-visible">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-gray-400">
                  <Receipt className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-white">The Deal</h2>
              </div>

              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="dealAmount" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    Deal Amount
                    <InfoTooltip content="The total amount the brand is paying you for this sponsorship deal before any deductions." />
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium font-mono">$</span>
                    <Input
                      id="dealAmount"
                      type="number"
                      value={inputs.dealAmount || ""}
                      onChange={handleInputChange("dealAmount")}
                      className="pl-8 h-11 rounded-lg bg-[#0F1115] border-white/10 text-white font-mono focus:ring-2 focus:ring-[#F4C430]/50 focus:border-[#F4C430]"
                      placeholder="0"
                      data-testid="input-deal-amount"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedHours" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      Estimated Hours
                      <InfoTooltip content="Total time you'll spend on this deal including filming, editing, communication, and admin work." />
                    </Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      value={inputs.estimatedHours || ""}
                      onChange={handleInputChange("estimatedHours")}
                      className="h-11 rounded-lg bg-[#0F1115] border-white/10 text-white font-mono focus:ring-2 focus:ring-[#F4C430]/50 focus:border-[#F4C430]"
                      placeholder="0"
                      data-testid="input-estimated-hours"
                    />
                    <p className="text-xs text-gray-500">Filming, editing, admin</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revisions" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-gray-500" />
                      Revisions
                      <InfoTooltip content="Number of revision rounds the brand may request. Each revision typically adds about 2 hours of work." />
                    </Label>
                    <Input
                      id="revisions"
                      type="number"
                      value={inputs.revisions || ""}
                      onChange={handleInputChange("revisions")}
                      className="h-11 rounded-lg bg-[#0F1115] border-white/10 text-white font-mono focus:ring-2 focus:ring-[#F4C430]/50 focus:border-[#F4C430]"
                      placeholder="0"
                      min="0"
                      data-testid="input-revisions"
                    />
                    <p className="text-xs text-gray-500">+2 hours each</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expenses" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      Expenses
                      <InfoTooltip content="One-off costs for this specific project (e.g., stock photos, contractor fees, specific fonts)." />
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium font-mono">$</span>
                      <Input
                        id="expenses"
                        type="number"
                        value={inputs.expenses || ""}
                        onChange={handleInputChange("expenses")}
                        className="pl-8 h-11 rounded-lg bg-[#0F1115] border-white/10 text-white font-mono focus:ring-2 focus:ring-[#F4C430]/50 focus:border-[#F4C430]"
                        placeholder="0"
                        data-testid="input-expenses"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Props, contractors</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxRate" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Percent className="w-4 h-4 text-gray-500" />
                      Tax Rate
                      <InfoTooltip content="The percentage set aside for taxes. A safe bet for freelancers is usually 25-30%." />
                    </Label>
                    <div className="relative">
                      <Input
                        id="taxRate"
                        type="number"
                        value={inputs.taxRate || ""}
                        onChange={handleInputChange("taxRate")}
                        className="pr-8 h-11 rounded-lg bg-[#0F1115] border-white/10 text-white font-mono focus:ring-2 focus:ring-[#F4C430]/50 focus:border-[#F4C430]"
                        placeholder="0"
                        min="0"
                        max="100"
                        data-testid="input-tax-rate"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium font-mono">%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={toggleAdvancedCosts}
                    className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    data-testid="button-toggle-advanced"
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      Add Advanced Costs (Software & Agency Fees)
                    </span>
                    {showAdvancedCosts ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>

                  {showAdvancedCosts && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="softwareCosts" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          Software Subs
                          <InfoTooltip content="Monthly tools you pay for to do the work (Adobe, ChatGPT, Hosting, etc.)." />
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium font-mono">$</span>
                          <Input
                            id="softwareCosts"
                            type="number"
                            value={inputs.softwareCosts || ""}
                            onChange={handleInputChange("softwareCosts")}
                            className="pl-8 h-11 rounded-lg bg-[#0F1115] border-white/10 text-white font-mono focus:ring-2 focus:ring-[#F4C430]/50 focus:border-[#F4C430]"
                            placeholder="0"
                            data-testid="input-software-costs"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="agencyFees" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          Agency Fees
                          <InfoTooltip content="Fees taken by platforms (Upwork/Fiverr) or commissions paid to an agent." />
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium font-mono">$</span>
                          <Input
                            id="agencyFees"
                            type="number"
                            value={inputs.agencyFees || ""}
                            onChange={handleInputChange("agencyFees")}
                            className="pl-8 h-11 rounded-lg bg-[#0F1115] border-white/10 text-white font-mono focus:ring-2 focus:ring-[#F4C430]/50 focus:border-[#F4C430]"
                            placeholder="0"
                            data-testid="input-agency-fees"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-[#161B22] rounded-xl border border-white/10 shadow-none overflow-visible">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-gray-400">
                  <Target className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-white">Your Standards</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Label className="text-sm font-medium text-gray-300">
                    Minimum Hourly Floor
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white font-mono" data-testid="text-minimum-floor">
                      {formatCurrency(minimumFloor)}
                    </span>
                    <span className="text-sm text-gray-500 font-mono">/hr</span>
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

                <div className="flex justify-between text-xs text-gray-500 font-mono">
                  <span>$25/hr</span>
                  <span>$500/hr</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="px-4 text-center space-y-3 pb-8">
            <p className="text-xs text-gray-600 leading-relaxed" data-testid="text-disclaimer">
              This calculator provides estimates for informational purposes only and should not be considered financial or tax advice. Consult a qualified professional for your specific situation.
            </p>
            <p className="text-sm text-gray-600" data-testid="text-footer">
              Built by{" "}
              <a 
                href="https://creatoraiplaybook.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#F4C430] transition-colors font-medium"
                data-testid="link-playbook-media"
              >
                Udaller
              </a>
              . Get the full system at{" "}
              <a 
                href="https://creatoraiplaybook.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#F4C430] transition-colors font-medium"
                data-testid="link-creator-playbook"
              >
                creatoraiplaybook.co
              </a>
            </p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-[#161B22]/95 backdrop-blur-sm border-t border-white/10 shadow-lg z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Card 
            className={`rounded-xl border transition-all duration-300 overflow-visible shadow-none ${
              calculations.isApproved 
                ? "bg-emerald-950/40 border-emerald-500/20" 
                : "bg-red-950/40 border-red-500/20"
            }`}
          >
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    calculations.isApproved 
                      ? "bg-emerald-500/10 text-emerald-400" 
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    {calculations.isApproved 
                      ? <CheckCircle2 className="w-6 h-6" />
                      : <XCircle className="w-6 h-6" />
                    }
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-medium uppercase tracking-wide ${
                        calculations.isApproved ? "text-emerald-400" : "text-red-400"
                      }`}>
                        Effective Hourly Rate
                      </p>
                      <InfoTooltip content="Your true earnings per hour after deducting taxes and expenses from the deal amount." />
                    </div>
                    <p className={`text-3xl md:text-4xl font-bold font-mono ${
                      calculations.isApproved ? "text-emerald-400" : "text-red-400"
                    }`} data-testid="text-effective-rate">
                      {formatCurrencyWithCents(calculations.effectiveRate)}
                      <span className="text-lg font-normal opacity-70">/hr</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`flex-1 inline-flex justify-center py-1.5 px-4 text-sm font-semibold rounded-lg cursor-default select-none ${
                        calculations.isApproved 
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                      data-testid="badge-deal-status"
                    >
                      {calculations.isApproved ? "GREEN LIGHT: Good Deal" : "RED FLAG: Negotiate Higher"}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleCopySummary}
                      className="shrink-0 border-white/20 text-white hover:bg-white/5"
                      data-testid="button-copy-summary"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <Button 
                    className="bg-[#F4C430] hover:bg-[#D4A017] text-[#0F1115] font-bold gap-2 rounded-lg"
                    data-testid="button-lock-deal"
                    asChild
                  >
                    <a href="https://www.honeybook.com" target="_blank" rel="noopener noreferrer">
                      Lock in this deal with a contract
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500">Net Revenue</p>
                  <p className="text-sm font-semibold text-white font-mono" data-testid="text-net-revenue">
                    {formatCurrency(calculations.netRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Hours</p>
                  <p className="text-sm font-semibold text-white font-mono" data-testid="text-total-hours">
                    {calculations.totalHours}h
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Your Floor</p>
                  <p className="text-sm font-semibold text-white font-mono" data-testid="text-floor-comparison">
                    {formatCurrency(minimumFloor)}/hr
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
