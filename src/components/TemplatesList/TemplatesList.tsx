import { useEffect, useState } from "react";
import CustomError from "../Error/Error";
import type HTMLTemplate from "../../types/HTMLTemplate";
import "./Template.css";
import { useNavigate } from "react-router-dom";

export default function TemplatesList() {
  const [templates, setTemplates] = useState<HTMLTemplate[]>([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [reloadKey, setReloadKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    async function getTemplates() {
      try {
        setIsloading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/htmltemplate`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data?.message ?? `HTTP error! status: ${response.status}`);
          return;
        }

        setTemplates(data as HTMLTemplate[]);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setIsloading(false);
      }
    }

    getTemplates();
  }, [reloadKey]);

  async function handleDelete(id: string) {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/htmltemplate/${id}`, {
        method: "DELETE",
      });
      setReloadKey((prev) => prev + 1);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
    navigate("/");
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <CustomError message={error} />;

  return templates.map((template) => (
    <div key={template.id} className="template-item">
      <span className="template-name">{template.name}</span>
      <div className="buttons">
        <button
          className="convert-btn"
          onClick={() => {
            navigate(`convertor/${template.id}`);
          }}
        >
          Convert to PDf
        </button>
        <button
          className="btn edit-btn"
          onClick={() => {
            navigate(`edit/${template.id}`);
          }}
        >
          Edit
        </button>
        <button
          className="btn delete-btn"
          onClick={() => handleDelete(template.id)}
        >
          Delete
        </button>
      </div>
    </div>
  ));
}
