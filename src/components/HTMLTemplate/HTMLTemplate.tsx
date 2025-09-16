import { useEffect, useState } from "react";
import type HTMLTemplate from "../../types/HTMLTemplate";
import "./HTMLTemplate.css";
import CustomError from "../Error/Error";
import { useNavigate, useParams } from "react-router-dom";

interface TemplateFormProps {
  template?: HTMLTemplate;
}

export default function TemplateForm({ template }: TemplateFormProps) {
  const [name, setName] = useState(template?.name ?? "");
  const [htmlContent, setContent] = useState(template?.htmlContent ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

  const isEdit = Boolean(id);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isEdit) return;

    async function fetchTemplate() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/htmltemplate/${id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setName(data.name);
        setContent(data.htmlContent);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchTemplate();
  }, [id, isEdit]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !htmlContent.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);

      const url = `${import.meta.env.VITE_API_URL}/api/htmltemplate`;

      const method = isEdit ? "PUT" : "POST";
      const body = isEdit
        ? JSON.stringify({ id, name, htmlContent })
        : JSON.stringify({ name, htmlContent });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(
          err?.message || `HTTP error! status: ${response.status}`
        );
      }

      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }

  if (error) return <CustomError message={error} />;

  return (
    <form className="template-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? "Edit Template" : "Create Template"}</h2>

      <div className="form-group">
        <label htmlFor="name">Template Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter template name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">HTML Content</label>
        <textarea
          id="content"
          value={htmlContent}
          onChange={(e) => setContent(e.target.value)}
          placeholder="<h1>Hello {{Name}}</h1>"
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading
          ? "Saving..."
          : isEdit
          ? "Update Template"
          : "Create Template"}
      </button>
    </form>
  );
}
