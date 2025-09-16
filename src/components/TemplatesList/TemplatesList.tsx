import { useEffect, useState } from "react";
import CustomError from "../Error/Error";
import type HTMLTemplate from "../../types/HTMLTemplate";
import "./Template.css";

export default function TemplatesList() {
  const [templates, setTemplates] = useState<HTMLTemplate[]>([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState<string | undefined>();

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
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <CustomError message={error} />;

  return templates.map((template) => (
    <div key={template.id} className="template-item">
      <span className="template-name">{template.name}</span>
      <div className="buttons">
        <button className="btn edit-btn">Edit</button>
        <button className="btn delete-btn">Delete</button>
      </div>
    </div>
  ));
}
