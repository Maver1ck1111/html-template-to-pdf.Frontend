import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type HTMLTemplate from "../../types/HTMLTemplate";
import CustomError from "../Error/Error";
import "./Convertor.css";

export default function TemplateEditor() {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<HTMLTemplate | null>(null);
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchTemplate() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/htmltemplate/${id}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data: HTMLTemplate = await res.json();
        setTemplate(data);

        const matches = data.htmlContent.matchAll(/\{\{(\w+)\}\}/g);
        const keys = Array.from(matches, (m) => m[1]);
        setPlaceholders(keys);

        const initialValues: Record<string, string> = {};
        keys.forEach((k) => (initialValues[k] = ""));
        setValues(initialValues);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    }

    fetchTemplate();
  }, [id]);

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleConvertToPdf() {
    if (!template) return;

    for (const key of placeholders) {
      if (!values[key]?.trim()) {
        setError(`Field "${key}" is required`);
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/htmltemplate/createpdf/${
          template.id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${template.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <CustomError message={error} />;
  if (!template) return null;

  return (
    <div className="template-editor">
      <div className="editor-left">
        <h3>Fill placeholders</h3>
        {placeholders.map((key) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>{key}</label>
            <input
              id={key}
              type="text"
              value={values[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              required
            />
          </div>
        ))}

        <button onClick={handleConvertToPdf} className="convert-btn">
          Convert to PDF
        </button>
      </div>

      <div className="editor-right">
        <h3>Preview</h3>
        <div
          className="preview"
          dangerouslySetInnerHTML={{ __html: template.htmlContent }}
        />
      </div>
    </div>
  );
}
