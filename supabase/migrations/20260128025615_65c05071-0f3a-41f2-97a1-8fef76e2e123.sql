-- Fix admin_users table security: add INSERT and DELETE policies
CREATE POLICY "Only existing admins can insert admin_users"
ON public.admin_users
FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Only existing admins can delete admin_users"
ON public.admin_users
FOR DELETE
USING (public.is_admin());

-- Fix site_settings table security: add DELETE policy
CREATE POLICY "Only admins can delete site_settings"
ON public.site_settings
FOR DELETE
USING (public.is_admin());