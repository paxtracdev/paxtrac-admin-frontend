import React from "react";
import { Editor } from "@tinymce/tinymce-react";

/**
 * Shared self-hosted TinyMCE editor wrapper.
 * Loads TinyMCE assets from /tinymce/tinymce.min.js (public/tinymce)
 * using the GPLv2+ self-hosted license_key with zero Tiny Cloud calls.
 */
const TinyMceEditor = ({ init = {}, ...props }) => {
  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      init={{
        license_key: "gpl",
        ...init,
      }}
      {...props}
    />
  );
};

export default TinyMceEditor;
