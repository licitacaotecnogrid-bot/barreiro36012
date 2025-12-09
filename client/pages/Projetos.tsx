import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useProjetos } from "@/hooks/use-projetos";
import { useProfessores } from "@/hooks/use-professores";
import { useNavigate } from "react-router-dom";

const Projetos = () => {
  const navigate = useNavigate();
  const { projetosPesquisa, projetosExtensao, deleteProjetoPesquisa, deleteProjetoExtensao } = useProjetos();
  const { getProfessorById } = useProfessores();
  const [activeTab, setActiveTab] = useState("pesquisa");

  const handleDelete = (id: number, type: "pesquisa" | "extensao") => {
    if (window.confirm("Tem certeza que deseja deletar este projeto?")) {
      if (type === "pesquisa") {
        deleteProjetoPesquisa(id);
      } else {
        deleteProjetoExtensao(id);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Projetos</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Gerencie projetos de pesquisa e extensão</p>
        </div>
        <Button onClick={() => navigate("/projetos/novo")} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pesquisa">Pesquisa ({projetosPesquisa.length})</TabsTrigger>
          <TabsTrigger value="extensao">Extensão ({projetosExtensao.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pesquisa" className="space-y-4">
          {projetosPesquisa.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-muted-foreground mb-4">Nenhum projeto de pesquisa criado</p>
                <Button onClick={() => navigate("/projetos/novo")} variant="outline">
                  Criar Primeiro Projeto
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {projetosPesquisa.map((projeto) => {
                const professor = getProfessorById(projeto.professorCoordenadorId);
                return (
                  <Card key={projeto.id} className="flex flex-col hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-base sm:text-lg line-clamp-2">{projeto.titulo}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm mt-1">{projeto.areaTematica}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs">Pesquisa</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3 pb-3">
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">{projeto.descricao}</p>
                      <div className="text-xs space-y-1">
                        <p><strong>Data:</strong> {new Date(projeto.momentoOcorre).toLocaleDateString("pt-BR")}</p>
                        <p><strong>Coordenador:</strong> {professor?.nome || "Professor desconhecido"}</p>
                      </div>
                    </CardContent>
                    <div className="flex gap-2 border-t pt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-8 text-xs"
                        onClick={() => navigate(`/projetos/${projeto.id}/pesquisa/editar`)}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-8 text-xs text-destructive hover:text-destructive"
                        onClick={() => handleDelete(projeto.id, "pesquisa")}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Deletar
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="extensao" className="space-y-4">
          {projetosExtensao.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-muted-foreground mb-4">Nenhum projeto de extensão criado</p>
                <Button onClick={() => navigate("/projetos/novo")} variant="outline">
                  Criar Primeiro Projeto
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {projetosExtensao.map((projeto) => {
                const professor = getProfessorById(projeto.professorCoordenadorId);
                return (
                  <Card key={projeto.id} className="flex flex-col hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-base sm:text-lg line-clamp-2">{projeto.titulo}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm mt-1">{projeto.areaTematica}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs">Extensão</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3 pb-3">
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">{projeto.descricao}</p>
                      <div className="text-xs space-y-1">
                        <p><strong>Data:</strong> {new Date(projeto.momentoOcorre).toLocaleDateString("pt-BR")}</p>
                        <p><strong>Público-alvo:</strong> {projeto.tipoPessoasProcuram}</p>
                        <p><strong>Comunidade:</strong> {projeto.comunidadeEnvolvida}</p>
                        <p><strong>Coordenador:</strong> {professor?.nome || "Professor desconhecido"}</p>
                      </div>
                    </CardContent>
                    <div className="flex gap-2 border-t pt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-8 text-xs"
                        onClick={() => navigate(`/projetos/${projeto.id}/extensao/editar`)}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-8 text-xs text-destructive hover:text-destructive"
                        onClick={() => handleDelete(projeto.id, "extensao")}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Deletar
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projetos;
