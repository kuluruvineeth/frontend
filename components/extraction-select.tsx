import { Extraction } from "@prisma/client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type ExtractionSelectProps = {
  form: any;
  name: string;
  extractions: Extraction[];
};

export function ExtractionSelect({
  form,
  name,
  extractions,
}: ExtractionSelectProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mt-4">
          <FormLabel>Extraction UUID</FormLabel>
          <Select
            onValueChange={field.onChange as (value: string) => void}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="select an extraction as example" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Extractions</SelectLabel>
                {extractions.map((extraction) => (
                  <SelectItem key={extraction.id} value={extraction.id}>
                    {extraction.id} - {extraction.filename}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
