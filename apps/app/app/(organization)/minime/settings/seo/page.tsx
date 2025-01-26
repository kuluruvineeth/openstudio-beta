import Form from "@/components/forms/form";
import UploadImage from "@/components/forms/upload-image";
import { currentUser } from "@repo/backend/auth/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO",
};
export default async function SEO() {
  const user = await currentUser();
  const endpoint = "user";
  return (
    <div className="flex flex-col gap-2">
      <Form
        method="PATCH"
        endpoint={endpoint}
        title="SEO title"
        description="This title will be used for SEO. It's best to keep it between 50-60 characters."
        inputData={{
          name: "seoTitle",
          placeholder: "Your SEO title",
          defaultValue: user?.user_metadata?.seo_title || "",
          maxLength: 60,
        }}
        required={false}
      />
      <Form
        type="textarea"
        method="PATCH"
        endpoint={endpoint}
        title="SEO description"
        description="This description will be used for SEO. It's best to keep it between 150-160 characters."
        textareaData={{
          name: "seoDescription",
          placeholder: "Your SEO Description",
          defaultValue: user?.user_metadata?.seo_description || "",
          maxLength: 160,
        }}
        required={false}
      />
      <UploadImage
        title="Open graph image"
        description="This image will be used for SEO. It's best to keep it 1200x630."
        helpText="Up to 4MB"
        endpoint={endpoint}
        defaultValue={user?.user_metadata?.og_image}
        name="ogImage"
        folder="og-images"
      />
    </div>
  );
}
