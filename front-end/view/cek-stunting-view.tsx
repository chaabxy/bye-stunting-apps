"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormSection } from "@/components/cek-stunting/form-section";
import { InfoSection } from "@/components/cek-stunting/info-section";
import { ResultSection } from "@/components/cek-stunting/result-section";
import { WHOChartSection } from "@/components/cek-stunting/who-chart-section";
import { useCekStuntingPresenter } from "@/presenter/user/cek-stunting-presenter";

export default function CekStunting() {
  const {
    formData,
    errors,
    result,
    isLoading,
    activeTab,
    provinsis,
    kabupatens,
    kecamatans,
    desas,
    chartData,
    heightChartData,
    weightPercentile,
    heightPercentile,
    calendarView,
    selectedYear,
    selectedMonth,
    setActiveTab,
    setCalendarView,
    setSelectedYear,
    setSelectedMonth,
    presenter,
  } = useCekStuntingPresenter();

  const handlePrintReport = () => {
    if (result) {
      presenter.handlePrintReport(
        result,
        chartData,
        heightChartData,
        weightPercentile,
        heightPercentile,
        provinsis,
        kabupatens,
        kecamatans,
        desas
      );
    }
  };

  const handleShareWhatsApp = () => {
    if (result) {
      presenter.handleShareWhatsApp(
        result,
        chartData,
        heightChartData,
        weightPercentile,
        heightPercentile,
        provinsis,
        kabupatens,
        kecamatans,
        desas
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-4xl font-bold mb-3 bg-text from-blue-600 to-cyan-500 bg-clip-text text-primary">
          Cek Risiko <span className="text-secondary">Stunting</span>
        </h1>
        <p className="text-md text-muted-foreground max-w-2xl mx-auto">
          Masukkan data anak Anda untuk memeriksa risiko stunting dan dapatkan
          rekomendasi yang sesuai untuk tumbuh kembang optimal
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {result && (
          <TabsList className="grid w-full grid-cols-2 mb-8 text-text">
            <TabsTrigger value="form">Form Pemeriksaan</TabsTrigger>
            <TabsTrigger value="result">Hasil Analisis</TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="form">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FormSection
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                provinsis={provinsis}
                kabupatens={kabupatens}
                kecamatans={kecamatans}
                desas={desas}
                calendarView={calendarView}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onInputChange={presenter.handleChange}
                onSelectChange={presenter.handleSelectChange}
                onDateSelect={presenter.handleDateSelect}
                onSubmit={presenter.handleSubmit.bind(presenter)}
                onCalendarViewChange={setCalendarView}
                onYearChange={setSelectedYear}
                onMonthChange={setSelectedMonth}
              />
            </div>
            <div className="lg:col-span-1">
              <InfoSection />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="result">
          {result && (
            <div className="space-y-8">
              <ResultSection
                result={result}
                onBackToForm={() => setActiveTab("form")}
                onPrintReport={handlePrintReport}
                onShareWhatsApp={handleShareWhatsApp}
              />

              <WHOChartSection
                chartData={chartData}
                heightChartData={heightChartData}
                weightPercentile={weightPercentile}
                heightPercentile={heightPercentile}
                childName={formData.nama}
                result={result}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
