<?php

namespace App\Controller;

use libphonenumber\NumberParseException;
use libphonenumber\PhoneNumberUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class FormController extends AbstractController {

  /**
   * @return \Symfony\Component\HttpFoundation\Response
   */
  #[Route('/')]
  public function index(): Response {
    return $this->render('form/index.html.twig');
  }

  /**
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   */
  #[Route('/validate-phone', methods: ['POST'])]
  public function validatePhone(Request $request): JsonResponse {
    $phone = trim($request->request->get('phone', ''));

    $phoneNumberUtil = PhoneNumberUtil::getInstance();

    try {
      $phoneNumberUtil->parse($phone);
    }
    catch (NumberParseException $e) {
      if ($e->getCode() === NumberParseException::INVALID_COUNTRY_CODE) {
        return new JsonResponse([
          'status' => 'error',
          'message' => 'Missing or invalid country code. Please enter a valid phone number with country code. Example: +372 5555 5555.',
        ], 400);
      }

      return new JsonResponse([
        'status' => 'error',
        'message' => 'Please enter a valid phone number with country code. Example: +372 5555 5555.',
      ], 400);
    }

    return new JsonResponse([
      'status' => 'success',
      'message' => 'Phone number is valid!',
    ]);
  }

}
