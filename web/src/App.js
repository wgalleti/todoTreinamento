import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import http from "./services/http";
import { Button, Form, SelectBox } from "devextreme-react";
import "devextreme/dist/css/dx.light.compact.css";
import HtmlEditor from "devextreme-react/html-editor";

const htmlEditorToolbar = {
  items: [
    "undo",
    "redo",
    "separator",
    {
      name: "size",
      acceptedValues: ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"],
    },
    {
      name: "font",
      acceptedValues: [
        "Arial",
        "Courier New",
        "Georgia",
        "Impact",
        "Lucida Console",
        "Tahoma",
        "Times New Roman",
        "Verdana",
      ],
    },
    "separator",
    "bold",
    "italic",
    "strike",
    "underline",
    "separator",
    "alignLeft",
    "alignCenter",
    "alignRight",
    "alignJustify",
    "separator",
    "orderedList",
    "bulletList",
    "separator",
    {
      name: "header",
      acceptedValues: [false, 1, 2, 3, 4, 5],
    },
    "separator",
    "color",
    "background",
    "separator",
    "link",
    "image",
    "separator",
    "clear",
    "codeBlock",
    "blockquote",
    "separator",
    "insertTable",
    "deleteTable",
    "insertRowAbove",
    "insertRowBelow",
    "deleteRow",
    "insertColumnLeft",
    "insertColumnRight",
    "deleteColumn",
  ],
};

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [add, setAdd] = useState(false);
  const formRef = useRef();

  const carregar = useCallback(async () => {
    if (!usuario) {
      setTarefas([]);
      return;
    }
    const { data } = await http.get("/todo/tarefas/", {
      params: {
        usuario,
      },
    });
    setTarefas(data);
  }, [setTarefas, usuario]);

  const carregarUsuarios = useCallback(async () => {
    const { data } = await http.get("/todo/usuarios/");
    setUsuarios(data);
  }, [setUsuarios]);

  useEffect(() => {
    carregar();
    carregarUsuarios();
  }, [carregar, carregarUsuarios]);

  useEffect(() => {
    carregar();
  }, [usuario]);

  async function handleFinalizar(id) {
    await http.patch(`/todo/tarefas/${id}/`, {
      fechada: true,
    });
    carregar();
  }

  function handleUsuarioSelect({ selectedItem }) {
    setUsuario(selectedItem?.id);
  }

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const form = formRef.current.instance;
      const data = form.option("formData");
      await http.post("/todo/tarefas/", { ...data, usuario: usuario });
      carregar();
      form.resetValues();
      setAdd(false);
    },
    [usuario]
  );

  const formConfig = useMemo(
    () => ({
      items: [
        {
          dataField: "titulo",
          validationRules: [
            {
              type: "required",
              message: "Título é obrigatório",
            },
          ],
        },
        {
          dataField: "descricao",
          editorType: "dxHtmlEditor",
          editorOptions: {
            height: 300,
            toolbar: htmlEditorToolbar,
          },
          validationRules: [
            {
              type: "required",
              message: "Descrição é obrigatório",
            },
          ],
        },
        {
          itemType: "button",
          buttonOptions: {
            text: "Cancelar",
            icon: "clear",
            onClick: () => {
              const form = formRef.current.instance;
              form.resetValues();
              setAdd(false);
            },
          },
        },
        {
          itemType: "button",
          buttonOptions: {
            text: "Salvar",
            icon: "check",
            useSubmitBehavior: true,
          },
        },
      ],
    }),
    []
  );

  return (
    <div className="w-[800px] mx-auto">
      <div className="toolbar flex justify-between border-b my-3 py-2">
        <h1 className="text-2xl uppercase text-purple-700">Todo app</h1>
        <div className="flex gap-2">
          <Button
            icon="plus"
            className="order-1 mt-2"
            onClick={() => setAdd(true)}
          />
          <SelectBox
            label="Usuários"
            showClearButton
            dataSource={usuarios}
            valueExpr="id"
            displayExpr="full_name"
            className="order-2"
            onSelectionChanged={handleUsuarioSelect}
          />
        </div>
      </div>

      <div className={`${add ? "block" : "hidden"}`}>
        <form onSubmit={handleSubmit}>
          <Form ref={formRef} showColonAfterLabel={false} {...formConfig} />
        </form>
      </div>

      <div className="lista">
        {tarefas.map((t) => (
          <div
            key={t.id}
            className={`${
              t.fechada ? "line-through" : ""
            } uppercase cursor-pointer p-2 border-b flex flex-col text-xl`}
            onClick={() => handleFinalizar(t.id)}
          >
            {t.titulo} <small className="font-thin">{t.descricao}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
