/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from 'components/ui/button';
import { DialogHeader, DialogTitle } from 'components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from 'components/ui/form';
import { Input } from 'components/ui/input';

export const URLSchema = z.object({
  url: z.string().url(),
  title: z.string(),
});

interface EditLinkProps {
  onClose: () => void;
}

export function EditLink({ onClose }: EditLinkProps) {
  const form = useForm<z.infer<typeof URLSchema>>({
    resolver: zodResolver(URLSchema),
    defaultValues: {
      url: '',
      title: '',
    },
  });

  const onSubmit = () => {};

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-md text-foreground font-normal">
          Edit link
        </DialogTitle>
      </DialogHeader>
      <div className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/tegonhq/tegon/issues/1"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
