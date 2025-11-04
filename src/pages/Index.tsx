import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Apiary {
  id: number;
  name: string;
  location: string;
  hiveCount: number;
  totalHoney: number;
  avgPerHive: number;
  status: "active" | "dormant" | "maintenance";
}

interface Hive {
  id: number;
  apiaryId: number;
  number: string;
  queenAge: number;
  strength: number;
  lastInspection: string;
  honeyCollected: number;
}

interface HarvestRecord {
  date: string;
  amount: number;
  hiveId: number;
  season: string;
}

const Index = () => {
  const [apiaries] = useState<Apiary[]>([
    { id: 1, name: "Солнечная поляна", location: "Луговая, участок 15", hiveCount: 12, totalHoney: 324, avgPerHive: 27, status: "active" },
    { id: 2, name: "Лесная опушка", location: "Сосновый бор, кордон 3", hiveCount: 8, totalHoney: 256, avgPerHive: 32, status: "active" },
    { id: 3, name: "Северная пасека", location: "Деревня Пчеловодово", hiveCount: 15, totalHoney: 390, avgPerHive: 26, status: "maintenance" },
  ]);

  const [hives] = useState<Hive[]>([
    { id: 1, apiaryId: 1, number: "П1-01", queenAge: 2, strength: 85, lastInspection: "2024-10-28", honeyCollected: 32 },
    { id: 2, apiaryId: 1, number: "П1-02", queenAge: 1, strength: 92, lastInspection: "2024-10-28", honeyCollected: 28 },
    { id: 3, apiaryId: 1, number: "П1-03", queenAge: 3, strength: 78, lastInspection: "2024-10-25", honeyCollected: 25 },
    { id: 4, apiaryId: 2, number: "Л2-01", queenAge: 1, strength: 95, lastInspection: "2024-10-30", honeyCollected: 35 },
    { id: 5, apiaryId: 2, number: "Л2-02", queenAge: 2, strength: 88, lastInspection: "2024-10-30", honeyCollected: 33 },
  ]);

  const [harvestRecords] = useState<HarvestRecord[]>([
    { date: "2024-06-15", amount: 45, hiveId: 1, season: "Весна" },
    { date: "2024-07-20", amount: 62, hiveId: 1, season: "Лето" },
    { date: "2024-08-25", amount: 38, hiveId: 1, season: "Лето" },
    { date: "2024-06-18", amount: 52, hiveId: 4, season: "Весна" },
    { date: "2024-07-22", amount: 68, hiveId: 4, season: "Лето" },
  ]);

  const totalHoney = apiaries.reduce((sum, a) => sum + a.totalHoney, 0);
  const totalHives = apiaries.reduce((sum, a) => sum + a.hiveCount, 0);
  const activeApiaries = apiaries.filter(a => a.status === "active").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-secondary text-white";
      case "dormant": return "bg-muted text-muted-foreground";
      case "maintenance": return "bg-primary/20 text-primary";
      default: return "bg-muted";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Активна";
      case "dormant": return "Зимовка";
      case "maintenance": return "Обслуживание";
      default: return status;
    }
  };

  const getSeasonStats = () => {
    const seasons = ["Весна", "Лето", "Осень"];
    return seasons.map(season => {
      const records = harvestRecords.filter(r => r.season === season);
      const total = records.reduce((sum, r) => sum + r.amount, 0);
      return { season, total, count: records.length };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Icon name="Flower2" className="text-primary" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Пчеловодство</h1>
                <p className="text-muted-foreground">Управление пасеками и учёт медосбора</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <Icon name="Plus" size={20} />
                  Добавить пасеку
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Новая пасека</DialogTitle>
                  <DialogDescription>Создайте новую пасеку для учёта ульев</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Название</Label>
                    <Input id="name" placeholder="Солнечная поляна" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Местоположение</Label>
                    <Input id="location" placeholder="Луговая, участок 15" />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">Создать</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="Warehouse" size={18} />
                Всего пасек
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{apiaries.length}</div>
              <p className="text-sm text-muted-foreground mt-1">{activeApiaries} активных</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-2 border-secondary/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="Box" size={18} />
                Всего ульев
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-secondary">{totalHives}</div>
              <p className="text-sm text-muted-foreground mt-1">в {apiaries.length} пасеках</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-2 border-accent/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="Droplet" size={18} />
                Собрано мёда
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-accent">{totalHoney}</div>
              <p className="text-sm text-muted-foreground mt-1">кг в этом сезоне</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="apiaries" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="apiaries" className="gap-2">
              <Icon name="Warehouse" size={16} />
              Пасеки
            </TabsTrigger>
            <TabsTrigger value="hives" className="gap-2">
              <Icon name="Box" size={16} />
              Ульи
            </TabsTrigger>
            <TabsTrigger value="harvest" className="gap-2">
              <Icon name="BarChart3" size={16} />
              Медосбор
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Icon name="Calendar" size={16} />
              Календарь работ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="apiaries" className="space-y-4">
            {apiaries.map((apiary) => (
              <Card key={apiary.id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-2xl">{apiary.name}</CardTitle>
                        <Badge className={getStatusColor(apiary.status)}>{getStatusText(apiary.status)}</Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2 text-base">
                        <Icon name="MapPin" size={16} />
                        {apiary.location}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Icon name="Settings" size={16} />
                      Управление
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Ульев</p>
                      <p className="text-2xl font-semibold text-foreground">{apiary.hiveCount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Всего мёда</p>
                      <p className="text-2xl font-semibold text-primary">{apiary.totalHoney} кг</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Средний сбор</p>
                      <p className="text-2xl font-semibold text-secondary">{apiary.avgPerHive} кг/улей</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="hives" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hives.map((hive) => {
                const apiary = apiaries.find(a => a.id === hive.apiaryId);
                return (
                  <Card key={hive.id} className="hover:shadow-lg transition-shadow border-2 hover:border-secondary/30">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{hive.number}</CardTitle>
                          <CardDescription className="mt-1">{apiary?.name}</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-muted">
                          Матка: {hive.queenAge} года
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Сила семьи</span>
                          <span className="font-semibold">{hive.strength}%</span>
                        </div>
                        <Progress value={hive.strength} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Последний осмотр</p>
                          <p className="text-sm font-medium">{new Date(hive.lastInspection).toLocaleDateString('ru-RU')}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Собрано мёда</p>
                          <p className="text-sm font-medium text-primary">{hive.honeyCollected} кг</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="harvest" className="space-y-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BarChart3" size={24} />
                  Статистика медосбора по сезонам
                </CardTitle>
                <CardDescription>Анализ продуктивности за текущий год</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {getSeasonStats().map((stat) => (
                    <div key={stat.season} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Icon name="Sun" size={20} className="text-primary" />
                          <span className="font-semibold text-lg">{stat.season}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-primary">{stat.total} кг</span>
                          <span className="text-sm text-muted-foreground ml-2">({stat.count} откачек)</span>
                        </div>
                      </div>
                      <Progress value={(stat.total / 200) * 100} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/20">
              <CardHeader>
                <CardTitle>Последние записи медосбора</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {harvestRecords.slice(0, 5).map((record, idx) => {
                    const hive = hives.find(h => h.id === record.hiveId);
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <Icon name="Droplet" size={18} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{hive?.number}</p>
                            <p className="text-sm text-muted-foreground">{new Date(record.date).toLocaleDateString('ru-RU')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">{record.amount} кг</p>
                          <Badge variant="outline" className="mt-1">{record.season}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card className="border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Calendar" size={24} />
                  Плановые работы на ноябрь
                </CardTitle>
                <CardDescription>Сезонные задачи по уходу за пасекой</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { task: "Подготовка к зимовке", date: "1-10 ноября", priority: "high", done: true },
                    { task: "Утепление ульев", date: "5-15 ноября", priority: "high", done: true },
                    { task: "Проверка вентиляции", date: "15-20 ноября", priority: "medium", done: false },
                    { task: "Установка защиты от грызунов", date: "20-25 ноября", priority: "medium", done: false },
                    { task: "Финальный осмотр перед зимой", date: "25-30 ноября", priority: "high", done: false },
                  ].map((item, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${item.done ? 'bg-muted/50 border-muted' : 'bg-card border-border hover:border-accent/30'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.done ? 'bg-secondary border-secondary' : 'border-border'}`}>
                          {item.done && <Icon name="Check" size={14} className="text-white" />}
                        </div>
                        <div>
                          <p className={`font-medium ${item.done ? 'line-through text-muted-foreground' : ''}`}>{item.task}</p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                      <Badge className={item.priority === 'high' ? 'bg-primary text-white' : 'bg-muted'}>
                        {item.priority === 'high' ? 'Важно' : 'Обычно'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
