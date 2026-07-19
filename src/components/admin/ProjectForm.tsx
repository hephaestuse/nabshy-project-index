import type { Project } from "@prisma/client";

type ProjectFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  project?: Project | null;
};

function Field({
  name,
  label,
  defaultValue,
  required = true,
}: {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>
      <input
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="mt-2 w-full border border-[#071A33]/25 px-3 py-2 outline-none focus:ring-2 focus:ring-[#071A33]"
      />
    </label>
  );
}

export function ProjectForm({ action, project }: ProjectFormProps) {
  return (
    <form action={action} className="grid gap-5 md:grid-cols-2">
      <Field name="slug" label="Slug" defaultValue={project?.slug} />
      <Field name="sortOrder" label="Sort order" defaultValue={project?.sortOrder ?? 0} />
      <Field name="titleFa" label="Persian title" defaultValue={project?.titleFa} />
      <Field name="titleEn" label="English title" defaultValue={project?.titleEn} />
      <Field name="cityFa" label="Persian city" defaultValue={project?.cityFa} />
      <Field name="cityEn" label="English city" defaultValue={project?.cityEn} />
      <Field
        name="developerNameFa"
        label="Persian developer"
        defaultValue={project?.developerNameFa}
      />
      <Field
        name="developerNameEn"
        label="English developer"
        defaultValue={project?.developerNameEn}
      />
      <Field name="usageFa" label="Persian usage" defaultValue={project?.usageFa} />
      <Field name="usageEn" label="English usage" defaultValue={project?.usageEn} />
      <Field name="addressFa" label="Persian address" defaultValue={project?.addressFa} />
      <Field name="addressEn" label="English address" defaultValue={project?.addressEn} />
      <label className="block">
        <span className="text-sm font-bold">Card image</span>
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-2 w-full border border-[#071A33]/25 px-3 py-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-bold">Brochure PDF</span>
        <input
          name="brochure"
          type="file"
          accept="application/pdf"
          className="mt-2 w-full border border-[#071A33]/25 px-3 py-2"
        />
      </label>
      <label className="flex items-center gap-2">
        <input name="isActive" type="checkbox" defaultChecked={project?.isActive ?? true} />
        <span className="text-sm font-bold">Active</span>
      </label>
      <div className="md:col-span-2">
        <button type="submit" className="bg-[#071A33] px-5 py-3 text-sm font-bold text-white">
          Save project
        </button>
      </div>
    </form>
  );
}
