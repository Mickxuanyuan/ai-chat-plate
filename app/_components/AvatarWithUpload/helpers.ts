export async function readAsDataURL(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", () =>
      reject(new Error("Failed to read file as data URL")),
    );
    reader.readAsDataURL(file);
  });
}

